'use strict';

import { Worker as NodeWorker, WorkerOptions as NodeWorkerOptions } from 'worker_threads';

interface NodeWorkerConstructor {
  new (path: string, options?: NodeWorkerOptions): NodeWorker;
}

export type TypedArray = Float32Array | Float64Array | Int8Array | Int16Array | Int32Array | Uint8Array | Uint8ClampedArray | Uint16Array | Uint32Array;

export interface WorkerRequest {
  subArray: TypedArray;
  source: string;
  index: number;
  args: any[];
}

export interface WorkerResponse {
  subArray: TypedArray;
}

export interface WorkerError {
  error: Error;
}

export interface WorkerEvent<T> extends MessageEvent {
  data: T;
}

export interface WorkerEventListener<T> {
  (event: WorkerEvent<T>): void;
}

export type WorkerRequestListener = WorkerEventListener<WorkerRequest>;

export type WorkerResponseListener = WorkerEventListener<WorkerResponse | WorkerError>;

export interface WorkerPort {
  postMessage (data: WorkerResponse | WorkerError, transfer?: ArrayBuffer[]): void;
  on (event: 'message', listener: WorkerRequestListener): void;
}

export interface Worker {
  postMessage (data: WorkerRequest, transfer?: ArrayBuffer[]): void;
  addEventListener (event: 'message', listener: WorkerResponseListener): void;
  terminate (): void;
}

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

    postMessage (data: WorkerRequest, transfer: ArrayBuffer[] = []) {
      this.nodeWorker.postMessage({ data }, transfer);
    }

    addEventListener (event: 'message', listener: WorkerResponseListener) {
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
