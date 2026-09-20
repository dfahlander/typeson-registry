// No means to set a `FileList` currently in jsdom so we
//   make our own `FileList`; Todo: jsdom should really support this:
//   https://github.com/jsdom/jsdom/issues/1272

/* eslint-disable jsdoc/valid-types --
    Constructor-type-returning-object-literal not parseable by jsdoc's
    type parser, though valid TypeScript */
/**
 * Builds a `FileList` polyfill class and installs a `files` getter/setter
 *   on the given `HTMLInputElement`'s prototype, so that assigning to
 *   `input.files` works (jsdom does not support this natively). The
 *   `HTMLInputElement` constructor is supplied by the caller (e.g.,
 *   `window.HTMLInputElement` from a `jsdom` instance) rather than read
 *   off a global, since it may not yet be set at the time this module is
 *   imported.
 * @param {typeof HTMLInputElement} HTMLInputElementCtor
 * @returns {new (files: ArrayLike<File>) => {
 *   [Symbol.toStringTag]: string,
 *   length: number,
 *   item: (index: import('typeson').Integer) => File
 * }}
 */
function buildFileList (HTMLInputElementCtor) {
    /* eslint-enable jsdoc/valid-types -- See above */
    /**
     * `FileList` polyfill.
     */
    class FileListPolyfill {
        /**
         * @param {ArrayLike<File>} files
         */
        constructor (files) {
            /** @type {ArrayLike<File>} */
            this._files = files;
            this.length = files.length;
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

    Object.defineProperty(HTMLInputElementCtor.prototype, 'files', {
        get () {
            // @ts-ignore -- Private API
            // eslint-disable-next-line @stylistic/max-len -- Long
            // eslint-disable-next-line unicorn/no-this-outside-of-class -- Monkeypatching
            return new FileListPolyfill(this._files);
        },
        set (val) {
            // eslint-disable-next-line @stylistic/max-len -- Long
            // eslint-disable-next-line unicorn/no-this-outside-of-class -- Monkeypatching
            this._files = val;
        }
    });

    return FileListPolyfill;
}

export {buildFileList};
