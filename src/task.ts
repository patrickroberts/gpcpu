'use strict';

import { MessageRequest, MessageResponseListener } from './message';
import { NodeWorker, NodeWorkerConstructor, NodeWorkerOptions } from './node';
import Worker from './worker';

export type TaskOptions = WorkerOptions & NodeWorkerOptions;

interface TaskConstructor {
  new (path: string, options?: TaskOptions): Worker;
  prototype: Worker;
}

function getWorker (): TaskConstructor {
  const NodeWorker: NodeWorkerConstructor = require('worker_threads').Worker;

  return class implements Worker {
    private nodeWorker: NodeWorker;

    constructor (path: string, options?: TaskOptions) {
      this.nodeWorker = new NodeWorker(path, options);
    }

    postMessage (data: MessageRequest, transfer: ArrayBuffer[] = []) {
      this.nodeWorker.postMessage({ data }, transfer);
    }

    addEventListener (event: 'message', listener: MessageResponseListener) {
      this.nodeWorker.on(event, listener);
    }

    terminate () {
      this.nodeWorker.terminate();
    }
  };
}

const Task: TaskConstructor = typeof Worker === 'function'
? Worker
: getWorker();

export { Task };
