'use strict';

import { MessageRequest, MessageResponse } from './message';
import { NodeWorkerOptions } from './node';
import Task from './task';
import Worker from './worker';

interface Completions {
  resolve: (value: MessageResponse) => void;
  reject: (reason: Error) => void;
}

class Thread {
  private task: Worker;
  // task completion signaling
  // stored in insertion order
  private pending: Completions[] = [];

  constructor (path: string, options?: WorkerOptions & NodeWorkerOptions) {
    this.task = new Task(path, options);
    this.task.addEventListener('message', event => {
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
  postMessage (message: MessageRequest, transfer: ArrayBuffer[] = []) {
    return new Promise<MessageResponse>((resolve, reject) => {
      this.task.postMessage(message, transfer);
      this.pending.push({ resolve, reject });
    });
  }

  // cancels pending promises with rejection after terminating worker
  terminate () {
    this.task.terminate();

    for (const { reject } of this.pending.splice(0)) {
      reject(new Error('terminated'));
    }
  }
}

export = Thread;
