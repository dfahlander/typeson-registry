module.exports = {
    "extends": "ash-nazg/sauron-node",
    "parser": "babel-eslint",
    "parserOptions": {
        "sourceType": "module"
    },
    "env": {
        // We set these to `false` in order to make explicit in each file which
        //  polyfills are expected
        "node": false,
        "browser": false
    },
    "settings": {
        "polyfills": [
            "Array.from",
            "Array.isArray",
            "ArrayBuffer",
            "BigInt",
            "Blob",
            "console",
            "DataView",
            "Error",
            "File",
            "FileReader",
            "Float64Array",
            "ImageData",
            "Int8Array",
            "Intl",
            "JSON",
            "location.href",
            "Map",
            "Object.assign",
            "Object.defineProperty",
            "Object.entries",
            "Object.keys",
            "performance",
            "Promise",
            "Set",
            "Symbol",
            "Uint16Array",
            "Uint8Array",
            "Uint8ClampedArray",
            "URL",
            "window.performance",
            "Worker",
            "XMLHttpRequest"
        ]
    },
    "overrides": [
        {
            extends: [
                'plugin:chai-friendly/recommended',
                'plugin:chai-expect/recommended'
            ],
            files: ["test/**.js", "browser-test/**.js", "windows-devinstall.js"],
            rules: {
                'no-console': 'off'
            }
        },
        {
            files: ['**/*.html'],
            rules: {
                'import/unambiguous': 'off'
            }
        },
        {
            files: ["**/*.md"],
            settings: {
                polyfills: ["Float64Array", "Int8Array"]
            },
            rules: {
                "eol-last": ["off"],
                "no-console": ["off"],
                "no-undef": ["off"],
                "padded-blocks": ["off"],
                "import/unambiguous": ["off"],
                "import/no-unresolved": ["off"],
                "import/no-commonjs": "off",
                "import/no-extraneous-dependencies": "off",
                "node/no-extraneous-import": "off",
                "node/file-extension-in-import": "off",
                "import/extensions": "off",
                "global-require": "off",
                "max-len": "off",
                "no-restricted-syntax": ["off"],
                "node/no-missing-import": ["off"],
                "no-multi-spaces": "off",
                "jsdoc/require-jsdoc": "off",
                "no-shadow": ["error", {allow: ['URL']}],
                "no-unused-vars": ["error", {varsIgnorePattern: "^(typeson|tson)$"}],
                // Disable until may fix https://github.com/gajus/eslint-plugin-jsdoc/issues/211
                "indent": "off"
            }
        }
    ],
    "rules": {
        "indent": ["error", 4, {"outerIIFEBody": 0}],
        "node/no-unsupported-features/es-builtins": ["error", {
            ignores: ['BigInt']
        }]
    }
};
