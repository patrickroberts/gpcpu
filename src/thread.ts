'use strict';

import { WorkerOptions as NodeWorkerOptions } from 'worker_threads';
import { PortRequest, PortResponse } from './port';
import Worker, { WorkerInstance } from './worker';

interface Completions<T> {
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason: Error) => void;
}

class Thread {
  private worker: WorkerInstance;
  // task completion signaling
  // stored in insertion order
  private pending: Completions<PortResponse>[] = [];

  constructor (path: string, options?: WorkerOptions & NodeWorkerOptions) {
    this.worker = new Worker(path, options);
    this.worker.addEventListener('message', event => {
      if ('error' in event.data) {
        const { reject } = this.pending.shift()!;
        reject(event.data.error);
      } else {
        const { resolve } = this.pending.shift()!;
        resolve(event.data);
      }
    });
  }

  // returns a promise that settles when
  // message event receives response from worker
  postMessage (message: PortRequest, transfer: ArrayBuffer[] = []) {
    return new Promise<PortResponse>((resolve, reject) => {
      this.worker.postMessage(message, transfer);
      this.pending.push({ resolve, reject });
    });
  }

  // cancels pending promises with rejection after terminating worker
  terminate () {
    this.worker.terminate();

    for (const { reject } of this.pending.splice(0)) {
      reject(new Error('terminated'));
    }
  }
}

export = Thread;
