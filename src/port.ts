'use strict';

import { Worker as NodeWorker, WorkerOptions as NodeWorkerOptions } from 'worker_threads';

export { NodeWorker, NodeWorkerOptions };

export interface NodeWorkerConstructor {
  new (path: string, options?: NodeWorkerOptions): NodeWorker;
}

export type TypedArray = Float32Array | Float64Array | Int8Array | Int16Array | Int32Array | Uint8Array | Uint8ClampedArray | Uint16Array | Uint32Array;

export interface PortRequest {
  subArray: TypedArray;
  source: string;
  index: number;
  args: any[];
}

export interface PortResponse {
  subArray: TypedArray;
}

export interface PortError {
  error: Error;
}

export interface PortEvent<T> extends MessageEvent {
  data: T;
}

export interface PortEventListener<T> {
  (event: PortEvent<T>): void;
}

export type PortRequestListener = PortEventListener<PortRequest>;

export type PortResponseListener = PortEventListener<PortResponse | PortError>;

export default interface Port {
  postMessage (data: PortResponse | PortError, transfer?: ArrayBuffer[]): void;
  on (event: 'message', listener: PortRequestListener): void;
}
