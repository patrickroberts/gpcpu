'use strict';

import { MessageRequest, MessageResponseListener } from './message';
import { NodeWorker, NodeWorkerConstructor, NodeWorkerOptions } from './node';
import Worker from './worker';

export interface WorkerConstructor {
  new (path: string, options?: WorkerOptions & NodeWorkerOptions): Worker;
  prototype: Worker;
}

function getWorker (): WorkerConstructor {
  const NodeWorker: NodeWorkerConstructor = require('worker_threads').Worker;

  return class implements Worker {
    private nodeWorker: NodeWorker;

    constructor (path: string, options?: WorkerOptions & NodeWorkerOptions) {
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

export default typeof Worker === 'function'
? Worker as WorkerConstructor
: getWorker();
