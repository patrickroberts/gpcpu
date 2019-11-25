'use strict';

import { MessageRequest, MessageResponseListener } from './message';

export default interface Worker {
  postMessage (data: MessageRequest, transfer: ArrayBuffer[]): void;
  postMessage (data: MessageRequest, transfer?: undefined): void;
  addEventListener (event: 'message', listener: MessageResponseListener): void;
  terminate (): void;
}
