import ts from '@wessberg/rollup-plugin-ts';
import { terser } from "rollup-plugin-terser";
import replace from '@rollup/plugin-replace';
import { version } from './package.json';

const { UGLIFY_JS } = process.env;

export default {
  input: `${__dirname}/src/rmodal.ts`,
  output: {
    name: 'RModal',
    exports: 'default',
    sourcemap: true,
    interop: false,
    strict: false
  },
  plugins: [
    ts({
      hook: {
        outputPath(path, kind) {
          if (kind === 'declaration') {
            return `${__dirname}/index.d.ts`;
          }

          return path;
        }
      }
    }),
    replace({
      delimiters: ['@@', '@@'],
      preventAssignment: true,
      values: { VERSION: version }
    }),
    UGLIFY_JS ? terser({ mangle: true }) : false
  ].filter(Boolean)
};
