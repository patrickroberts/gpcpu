'use strict';

import { CpuInfo } from 'os';

function getCpus () {
  const cpus: () => CpuInfo[] = require('os').cpus;
  const { length } = cpus();

  return length;
}

export default typeof navigator !== 'undefined'
? navigator.hardwareConcurrency
: getCpus();
