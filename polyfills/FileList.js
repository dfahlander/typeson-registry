// No means to set a `FileList` currently in jsdom so we
//   make our own `FileList`; Todo: jsdom should really support this:
//   https://github.com/jsdom/jsdom/issues/1272

/**
 * `FileList` polyfill.
 */
class FileList {
    /**
     *
     */
    constructor () {
        // eslint-disable-next-line prefer-rest-params -- API
        this._files = arguments[0];
        this.length = this._files.length;
    }

    /**
     * @param {import('typeson').Integer} index
     * @returns {File}
     */
    item (index) {
        return this._files[index];
    }

    /* eslint-disable class-methods-use-this -- Not needed */
    /**
     * @returns {"FileList"}
     */
    get [Symbol.toStringTag] () {
        /* eslint-enable class-methods-use-this -- Not needed */
        return 'FileList';
    }
}

// eslint-disable-next-line unicorn/no-top-level-side-effects -- Ok
Object.defineProperty(globalThis.HTMLInputElement.prototype, 'files', {
    get () {
        // @ts-ignore -- Private API
        // eslint-disable-next-line @stylistic/max-len -- Long
        // eslint-disable-next-line unicorn/no-this-outside-of-class -- Monkeypatching
        return new FileList(this._files);
    },
    set (val) {
        // eslint-disable-next-line @stylistic/max-len -- Long
        // eslint-disable-next-line unicorn/no-this-outside-of-class -- Monkeypatching
        this._files = val;
    }
});

export {FileList};
