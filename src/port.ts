'use strict';

import { MessageResponse, MessageError, MessageRequestListener } from './message';

export default interface Port {
  postMessage (data: MessageResponse | MessageError, transfer?: ArrayBuffer[]): void;
  on (event: 'message', listener: MessageRequestListener): void;
}
