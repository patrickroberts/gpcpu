'use strict';

import { TypedArray } from './message';

export default interface Kernel {
  (subArray: TypedArray, localIndex: number, globalIndex: number, ...args: any[]): void;
}
