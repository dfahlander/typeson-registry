'use strict';

module.exports = {
    extends: ['ash-nazg/sauron-node-overrides'],
    parser: '@babel/eslint-parser',
    parserOptions: {
        requireConfigFile: false
    },
    env: {
        // We set these to `false` in order to make explicit in each file which
        //  polyfills are expected
        node: false,
        browser: false
    },
    settings: {
        jsdoc: {
            mode: 'typescript'
        },
        polyfills: [
            'Array.from',
            'Array.isArray',
            'ArrayBuffer',
            'BigInt',
            'Blob',
            'console',
            'createImageBitmap',
            'crypto',
            'DataView',
            'DOMException',
            'DOMMatrix',
            'DOMMatrixReadOnly',
            'DOMPoint',
            'DOMPointReadOnly',
            'DOMQuad',
            'DOMRect',
            'DOMRectReadOnly',
            'Error',
            'File',
            'FileList',
            'FileReader',
            'Float64Array',
            'ImageData',
            'Int8Array',
            'Intl',
            'JSON',
            'location.href',
            'Map',
            'Number.isNaN',
            'Number.NaN',
            'Number.parseInt',
            'Object.assign',
            'Object.defineProperty',
            'Object.entries',
            'Object.keys',
            'performance',
            'Promise',
            'Set',
            'Symbol',
            'Uint16Array',
            'Uint8Array',
            'Uint8ClampedArray',
            'URL',
            'window.performance',
            'Worker',
            'XMLHttpRequest'
        ]
    },
    overrides: [
        {
            files: [
                'test/**.js', 'browser-test/**.js', 'windows-devinstall.js'
            ],
            extends: [
                'plugin:chai-friendly/recommended',
                'plugin:chai-expect/recommended'
            ],
            env: {
                mocha: true
            },
            rules: {
                'no-console': 'off'
            }
        },
        {
            files: ['test/*.js'],
            rules: {
                'n/no-unsupported-features/es-syntax': ['error', {
                    ignores: ['modules', 'dynamicImport']
                }]
            }
        },
        {
            files: ['**/*.html', 'browser-test/**'],
            env: {
                browser: true
            },
            rules: {
                'import/unambiguous': 'off'
            }
        },
        {
            files: [
                'test/test-environment.js',
                'polyfills/createObjectURL.js',
                'windows-devinstall.js'
            ],
            env: {
                node: true
            },
            rules: {
                'compat/compat': 0
            }
        },
        {
            files: ['*.md/*.js', '*.md/*.html'],
            settings: {
                polyfills: ['Float64Array', 'Int8Array']
            },
            rules: {
                '@stylistic/max-len': 'off',
                'eol-last': 'off',
                'no-alert': 'off',
                'no-console': 'off',
                'no-undef': 'off',
                'padded-blocks': 'off',
                'no-restricted-syntax': 'off',
                'n/no-missing-import': 'off',
                'no-multi-spaces': 'off',
                'no-multiple-empty-lines': ['error', {
                    max: 1, maxBOF: 2, maxEOF: 1
                }],
                'jsdoc/require-jsdoc': 'off',
                'no-shadow': ['error', {allow: ['URL']}],
                'no-unused-vars': ['error', {
                    varsIgnorePattern: '^(typeson|tson|TSON)$'
                }],
                // Disable until may fix https://github.com/gajus/eslint-plugin-jsdoc/issues/211
                indent: 'off',
                'import/extensions': 'off',
                'import/unambiguous': 'off',
                'import/no-unresolved': 'off',
                'import/no-commonjs': 'off',
                'import/no-extraneous-dependencies': 'off',
                'n/no-extraneous-import': 'off',
                'n/file-extension-in-import': 'off',
                'n/global-require': 'off'
            }
        }
    ],
    rules: {
        // Disable for now
        'eslint-comments/require-description': 0,

        '@stylistic/brace-style': 0,
        '@stylistic/indent': ['error', 4, {outerIIFEBody: 0}],
        'n/no-unsupported-features/es-builtins': ['error', {
            ignores: ['BigInt']
        }],
        'unicorn/prefer-spread': 0
    }
};
