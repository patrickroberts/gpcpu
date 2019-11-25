'use strict';

import { MessagePort, Worker, WorkerOptions } from 'worker_threads';

export type NodeMessagePort = MessagePort;
export type NodeWorker = Worker;
export type NodeWorkerOptions = WorkerOptions;

export interface NodeWorkerConstructor {
  new (path: string, options?: NodeWorkerOptions): NodeWorker;
}
