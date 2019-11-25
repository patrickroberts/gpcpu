# gpcpu
Asynchronous Parallel Programming for TypedArray

## About

`gpcpu` enables user-friendly parallel programming in JavaScript by defining a `forEach()` function which executes a user-defined callback on multiple concurrent threads and returns a `Promise` that resolves when all the results have been copied to the TypedArray provided as input.

This significantly speeds up execution of sequential `for` loops over large typed arrays by delegating each block of execution to a concurrently running thread.

## Support

`gpcpu` provides out-of-the-box support for both browsers and [Node.js] by selectively using [Web Workers] or [Worker Threads] depending on the runtime environment. It also ships with typings for use in TypeScript projects.

## Install

### [npm] (Recommended)

```sh
npm i gpcpu
```

### [unpkg]

```html
<script src="https://unpkg.com/gpcpu"></script>
```

## Usage

```js
import { Manager } from 'gpcpu';

const parallel = new Manager(); // uses the number of threads your hardware can run concurrently by default
const fltArr = new Float64Array(100000000);

console.time('parallel');

parallel.forEach(fltArr, (subArr, localIndex, globalIndex) => {
  subArr[localIndex] = Math.sqrt(globalIndex);
}).then(() => {
  console.timeEnd('parallel'); // ~557ms on Intel Core i7-7700K @ 4.20GHz using 8 threads
  // use fltArr here
});
```

## Benchmark Comparison

```js
const fltArr = new Float64Array(100000000);

console.time('sequential');

for (let i = 0; i < fltArr.length; ++i) {
  fltArr[i] = Math.sqrt(i);
}

console.timeEnd('sequential'); // ~2564ms on Intel Core i7-7700K @ 4.20GHz
// use fltArr here
```

## Documentation

Available on [Github Pages].

[Node.js]: https://nodejs.org
[Web Workers]: https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API
[Worker Threads]: https://nodejs.org/api/worker_threads.html#worker_threads_worker_threads
[npm]: https://www.npmjs.com/package/gpcpu
[unpkg]: https://unpkg.com
[Github Pages]: https://patrickroberts.github.io/gpcpu/
