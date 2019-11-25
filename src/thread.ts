'use strict';

import { WorkerOptions as NodeWorkerOptions } from 'worker_threads';
import Worker, { WorkerRequest, WorkerResponse } from './worker';

interface Completions<T> {
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason: Error) => void;
}

class Thread extends Worker {
  // task completion signaling
  // stored in insertion order
  private pending: Completions<WorkerResponse>[] = [];

  constructor (path: string, options?: WorkerOptions & NodeWorkerOptions) {
    super(path, options);

    this.addEventListener('message', event => {
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
  postMessage (message: WorkerRequest, transfer: ArrayBuffer[] = []) {
    return new Promise<WorkerResponse>((resolve, reject) => {
      super.postMessage(message, transfer);
      this.pending.push({ resolve, reject });
    });
  }

  // cancels pending promises with rejection after terminating worker
  terminate () {
    super.terminate();

    for (const { reject } of this.pending.splice(0)) {
      reject(new Error('terminated'));
    }
  }
}

export = Thread;
