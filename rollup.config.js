import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default [{
    input: 'index-es6.js',
    output: {
        file: 'index.js',
        format: 'umd',
        name: 'Typeson'
    },
    plugins: [
        babel(),
        resolve({
            main: false
        }),
        commonjs()
    ]
}, {
    input: 'test/test.js',
    output: {
        file: 'test/test-polyglot.js',
        format: 'umd',
        name: 'Typeson'
    },
    plugins: [
        babel(),
        resolve({
            main: false
        }),
        commonjs()
    ]
}];
