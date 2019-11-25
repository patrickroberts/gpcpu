'use strict';

import child, { Kernel } from './child';
import cpus from './cpus';
import Thread from './thread';
import { TypedArray } from './worker';

class Manager {
  private threads: Thread[] = [];

  // initializes worker threads
  constructor (concurrency = cpus) {
    for (let i = 0; i < concurrency; ++i) {
      // eval property will be ignored by browser Workers
      this.threads.push(new Thread(child, { eval: true }));
    }
  }

  get concurrency () {
    return this.threads.length;
  }

  terminate () {
    for (const thread of this.threads) {
      thread.terminate();
    }
  }

  // invokes callbackFn in parallel for each index of typedArray
  // returns promise that resolves when all invocations are complete
  // or rejects if any invocations throw an error
  forEach = async (typedArray: TypedArray, callbackFn: Kernel, ...args: any[]) => {
    const source = String(callbackFn);
    const blockDim = Math.ceil(typedArray.length / this.concurrency);

    const promises = this.threads.map((thread, i) => {
      const index = i * blockDim;

      // don't initiate round-trip IPC with Worker for empty subArray
      if (index >= typedArray.length) return Promise.resolve();

      const subArray = typedArray.slice(index, index + blockDim);

      return thread.postMessage(
        { subArray, source, index, args },
        [subArray.buffer]
      ).then(({ subArray }) => {
        typedArray.set(subArray, index);
      });
    });

    await Promise.all(promises);
  };
}

export = Manager;
