'use strict';

import Kernel from './kernel';
import { TypedArray } from './message';
import { NodeMessagePort } from './node';
import Port from './port';

function registerListener () {
  function compileKernel (source: string): Kernel {
    return new Function(`return ${source}`)();
  }

  function callKernel (subArray: TypedArray, kernel: Kernel, index: number, ...args: any[]) {
    const params = [subArray, 0, index].concat(args) as Parameters<Kernel>;

    for (let i = 0; i < subArray.length; ++i) {
      params[1] = i;
      params[2] = index + i;

      kernel(...params);
    }
  }

  function getGlobalWorkerScope (): Port {
    return {
      postMessage (data, transfer = []) {
        // postMessage() calls global, not method
        postMessage(data, transfer);
      },
      on (event, listener) {
        addEventListener(event, listener);
      }
    };
  }

  function getParentPort (): Port {
    const parentPort: NodeMessagePort = require('worker_threads').parentPort;

    return {
      postMessage (data, transfer = []) {
        parentPort.postMessage({ data }, transfer);
      },
      on (event, listener) {
        parentPort.on(event, listener);
      }
    };
  }

  const port = typeof postMessage === 'function'
  ? getGlobalWorkerScope()
  : getParentPort();

  port.on('message', event => {
    try {
      const { subArray, source, index, args } = event.data;
      const kernel = compileKernel(source);
      const params = [subArray, kernel, index].concat(args) as [TypedArray, Kernel, number, ...any[]];

      callKernel(...params);

      port.postMessage({ subArray }, [subArray.buffer]);
    } catch (error) {
      port.postMessage({ error });
    }
  });
}

function getSource () {
  return `(${registerListener})();`;
}

function getObjectURL () {
  const blob = new Blob([getSource()], { type: 'application/javascript' });

  return URL.createObjectURL(blob);
}

export default typeof Blob === 'function'
? getObjectURL()
: getSource();
