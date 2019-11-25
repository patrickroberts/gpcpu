'use strict';

function getCpus () {
  const { cpus } = require('os');
  const { length } = cpus();

  return length;
}

export default typeof navigator !== 'undefined'
? navigator.hardwareConcurrency
: getCpus();
