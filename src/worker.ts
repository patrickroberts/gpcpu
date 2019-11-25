'use strict';

import { NodeWorker, NodeWorkerConstructor, NodeWorkerOptions, PortRequest, PortResponseListener } from './port';

export interface WorkerInstance {
  postMessage (data: PortRequest, transfer?: ArrayBuffer[]): void;
  addEventListener (event: 'message', listener: PortResponseListener): void;
  terminate (): void;
}

export interface WorkerConstructor {
  new (path: string, options?: WorkerOptions & NodeWorkerOptions): WorkerInstance;
  prototype: WorkerInstance;
}

function getWorker (): WorkerConstructor {
  const NodeWorker: NodeWorkerConstructor = require('worker_threads').Worker;

  return class implements WorkerInstance {
    private nodeWorker: NodeWorker;

    constructor (path: string, options?: WorkerOptions & NodeWorkerOptions) {
      this.nodeWorker = new NodeWorker(path, options);
    }

    postMessage (data: PortRequest, transfer: ArrayBuffer[] = []) {
      this.nodeWorker.postMessage({ data }, transfer);
    }

    addEventListener (event: 'message', listener: PortResponseListener) {
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
