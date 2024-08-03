import ashNazg from 'eslint-config-ash-nazg';
import nodePlugin from 'eslint-plugin-n';

export default [
    {
        ignores: [
            'dist/',
            '.idea',
            'polyfills/createObjectURL.umd.cjs',
            'coverage'
        ]
    },
    {
        settings: {
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
                'OffscreenCanvas',
                'Promise',
                'Set',
                'Symbol',
                'Uint16Array',
                'Uint8Array',
                'Uint8ClampedArray',
                'URL',
                'Worker',
                'XMLHttpRequest'
            ]
        }
    },
    ...ashNazg(['sauron']),
    {
        files: ['test/*.js'],
        rules: {
            'n/no-unsupported-features/es-syntax': ['error', {
                ignores: ['modules', 'dynamicImport']
            }]
        }
    },
    ...ashNazg(['sauron', 'browser']).map((cfg) => {
        return {
            ...cfg,
            files: ['**/*.html', 'browser-test/**'],
            rules: {
                ...cfg.rules,
                'import/unambiguous': 'off'
            }
        };
    }),
    ...ashNazg(['sauron', 'node']).map((cfg) => {
        return {
            files: [
                'test/test-environment.js',
                'polyfills/createObjectURL.js',
                'windows-devinstall.js'
            ],
            ...cfg
        };
    }),
    ...ashNazg(['sauron', 'mocha']).map((cfg) => {
        return {
            files: [
                'test/**.js', 'browser-test/**.js'
            ],
            ...cfg,
            rules: {
                ...cfg.rules,
                'no-console': 'off'
            }
        };
    }),
    ...ashNazg(['sauron', 'node']).map((cfg) => {
        return {
            files: [
                'windows-devinstall.js',
                'build.js'
            ],
            ...cfg,
            rules: {
                ...cfg.rules,
                'no-console': 'off'
            }
        };
    }),
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
    },
    {
        plugins: {
            n: nodePlugin
        },
        rules: {
            // Disable for now
            '@brettz9/no-use-ignored-vars': 0,
            '@stylistic/brace-style': 0,
            '@stylistic/indent': ['error', 4, {outerIIFEBody: 0}],
            'n/no-unsupported-features/es-builtins': ['error', {
                ignores: ['BigInt']
            }],
            'unicorn/prefer-spread': 0
        }
    }
];
