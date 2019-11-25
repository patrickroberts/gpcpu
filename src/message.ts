'use strict';

export type TypedArray = Float32Array | Float64Array | Int8Array | Int16Array | Int32Array | Uint8Array | Uint8ClampedArray | Uint16Array | Uint32Array;

export interface MessageRequest {
  subArray: TypedArray;
  source: string;
  index: number;
  args: any[];
}

export interface MessageResponse {
  subArray: TypedArray;
}

export interface MessageError {
  error: Error;
}

export interface MessageEvent<T> {
  data: T;
}

export interface MessageEventListener<T> {
  (event: MessageEvent<T>): void;
}

export type MessageRequestListener = MessageEventListener<MessageRequest>;

export type MessageResponseListener = MessageEventListener<MessageResponse | MessageError>;
