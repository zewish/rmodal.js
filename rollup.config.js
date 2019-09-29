const buble = require('rollup-plugin-buble');
const replace = require('rollup-plugin-replace');
const { uglify } = require('rollup-plugin-uglify');
const { version } = require('./package.json');
const { UGLIFY_JS } = process.env;

const plugins = [
    replace({
        delimiters: ['@@', '@@'],
        values: { VERSION: version }
    }),
    buble()
];

if (UGLIFY_JS) {
    plugins.push(
        uglify({ mangle: true })
    );
}

module.exports = {
    input: `${__dirname}/src/rmodal.js`,
    output: {
        name: 'RModal',
        sourcemap: true
    },
    plugins
};
