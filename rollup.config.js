import ts from 'rollup-plugin-ts';
import dts from 'rollup-plugin-dts';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

const name = 'gpcpu';
const input = 'src/manager.ts';
const external = ['os', 'worker_threads'];
const tsconfig = 'tsconfig.json';

export default [
  {
    input,
    output: { file: pkg.module, format: 'es' },
    plugins: [ts({ tsconfig })],
    external
  },
  {
    input,
    output: { file: pkg.main, format: 'umd', name, sourcemap: true },
    plugins: [ts({ tsconfig })]
  },
  {
    input,
    output: { file: pkg.browser, format: 'umd', name, sourcemap: true },
    plugins: [ts({ tsconfig }), terser()]
  },
  {
    input,
    output: { file: pkg.types, format: 'es' },
    plugins: [dts()]
  }
];
