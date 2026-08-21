declare global {
    // eslint-disable-next-line no-var -- Ambient global declaration
    var xmlHttpRequestOverrideMimeType:
        typeof import('../../polyfills/index.js')
            .xmlHttpRequestOverrideMimeType;
}

export {};
