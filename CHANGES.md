# typeson-registry

## 11.1.0

- feat: support `symbol` type
- feat: support `promise` type

## 11.0.2

- fix: properly export types for `createObjectURL` polyfill

## 11.0.1

- chore: ESLint 9/flat config; update devDeps.

## 11.0.0

BREAKING CHANGES:
- Requires Node 18.14.0+

- fix: for `overrideMimeType` polyfill for jsdom >= 22.0.0
- fix: get rid of `performance` usage as causing maximum recursion with
   latter jsdom versions
- fix: change from deprecated `readAsBinaryString` method to
    `readAsArrayBuffer`
- chore: require Node 18.14.0+

## 10.0.0

BREAKING CHANGES:
- Encodes array buffers as objects rather than strings in order to add any metadata
- For ImageBitmap, storage as object now necessary to retrieve width, height

- feat: add support for `maxByteLength`
- feat: revive synchronously with genuine ImageBitmap

## 9.2.1

- fix: allow `DOMRect`, `DOMPoint` and `DOMMatrix` to be undefined

## 9.2.0

- feat: Add `DOMQuad` type
- feat: Add `DOMPointReadOnly`, `DOMMatrixReadOnly`, `DOMRectReadOnly` types

## Version 9.1.1

- fix: Stop `Error` type from throwing in structured cloning
    throwing preset (as per new allowances)

## Version 9.1.0

- feat: Add types for `DOMMatrix` (and add to
    `structured-cloning` presets)

## Version 9.0.0

BREAKING: Removes `Intl` from structured cloning
BREAKING: Drop Node 16

- fix: remove `Intl` from structured-cloning presets as not
    supported
- feat: Add types for `DOMException`, `DOMRect`, `DOMPoint` (and
    add to `structured-cloning` presets))
- chore: update `whatwg-url` and devDeps.

## Version 8.0.0

BREAKING: Requires Node 16+, UMD extensions changed to ".cjs"

- fix: UMD extensions changed to ".cjs"
- chore: update base64-arraybuffer-es6, typeson, whatwg-url, devDeps.

## Version 7.2.1

- fix: switch `module` to nodenext

## Version 7.2.0

- fix: typing issue
- chore: update typeson and base64-arraybuffer-es6

## Version 7.1.0

- feat(`typed-arrays`): `BigInt64Array` and `BigUint64Array` support

## Version 7.0.1

- fix: ensure Typeson types are re-exported
- chore: fix tool for re-exporting typeson

## Version 7.0.0

- feat: TypeScript typings
- chore: update `typeson`, `base64-arraybuffer-es6` devDeps.

## Version 6.0.0

- fix: add negative 0 to SpecialNumbers so it can be serialized distinctly
- chore: update typeson and devDeps.

## Version 5.0.0

- feat: Add `stack`, `fileName`, `lineNumber`, `columnNumber`, `cause`,
    `errors` (for `AggregateError`) and `name` to `errors` (default `name`
    can be changed after construction); also impacts `builtin`, `universal`,
    `postmessage`, `socketio`, and SCA
- feat: Add `stack`, `fileName`, `lineNumber`, `columnNumber`, `cause`,
    `errors` (for `AggregateError`) to `error` (changes representation, but
    less likely than `errors` to be breaking); fixes #10
- test: use built-in webcrypto, updating for latest Node
- chore: bump `whatwg-url` dep.
- chore: update devDeps.
- chore(ci): bump Node to 18.15.0 (but works as early as 18.14.0)

## Version 4.0.0

With Typeson update, empty string components of key paths are now escaped
(as `''`) while `''` is escaped as `''''`.

- chore: update `typeson` and devDeps.

## Version 3.0.0

- BREAKING fix: Drop Node 12
- fix: global fetching
- chore: update typeson and devDeps.
- test: avoid skipping test in favor of temporarily setting up Node environment
    to work; simplify

## Version 2.0.0

- BREAKING feat: switch to using genuine ESM (keeping CJS), adding `exports`
- test: switch to c8 over nyc for ESM support
- test: check for import errors; avoid logging
- chore: bump base64-arraybuffer-es6, whatwg-url
- chore: update devDeps.

## Version 1.0.0

- Breaking change: Indicate minimum Node version as
    ^12.22.0 || ^14.17.0 || >=16.0.0.
- Breaking change: use native Node ESM
- Breaking fix: Preserve the full underlying buffer for `DataView` and
    typed arrays; add tests
- Breaking fix: If buffer is reused across `ArrayBuffer`, `DataView`,
    and/or typed arrays, rebuild cyclic references; add tests
- Breaking change (file names): Rename files
    `undefined.js` -> `undef.js` (preset too),
    `NaN.js`->`nan.js`, `Infinity.js`->`infinity.js`,
    `NegativeInfinity.js`->`negative-infinity.js`,
    `post-message.js` -> `postmessage.js`
- Breaking change (type name): Intl types must specify properties now without
    periods per apparent `export` limitations
- Breaking change (type name): Use `userObjects`->`userObject` on internal
    representation of types (consistent with pattern of reserving plurals
    for files containing multiple exports)
- Breaking change (type name): Export type objects lower-cased to avoid
    importing into context where they would conflict with built-in classes
    or objects: `ArrayBuffer`->`arraybuffer`, `Blob`->`blob`,
    `DataView`->`dataview`, `Date`->`date`, `Error`->`error`, `File`->`file`,
    `FileList`->`filelist`, `ImageBitmap`->`imagebitmap`,
    `ImageData`->`imagedata`, `Infinity`->`infinity`, `Map`->`map`,
    `NaN`->`nan`, `RegExp`->`regexp`, `Set`->`set`
- Breaking change (type name): For those that would still conflict
    (type and preset `undefined`->`undef`), abbreviate
- Breaking change (type name): Make type name consistent with file name
    (initial lower-cased camel-case type name (changing case only for
    genuinely separate words, not for API names) with hyphenated file
    name) `NegativeInfinity`->`negativeInfinity`,
    `nonBuiltInIgnore`->`nonbuiltinIgnore`,
- Breaking change (type name): Lower case exports from `errors.js`,
    `typed-arrays.js`, `typed-arrays-socketio.js`
- Breaking change (type name): `postMessage` preset is now preferred
    as `postmessage` (to avoid shadowing)
- Breaking change: For `cloneable`, look for `cloneEncapsulate` and
    `cloneRevive` global symbols instead of pseudo-private methods (Babel
    polyfills Symbol)
- Breaking change: Store arrays using new `arrayNonindexKeys` rather than
    `sparseUndefined` type to allow storage of non-index array keys
- Breaking and other changes: Upgraded version of Typeson (has own
    `module`)
- Breaking change: Make `SpecialNumbers` a preset consisting of new
    individual types for `NaN`, `Infinity`, `-Infinity`
- Breaking change: Node must reference `dist` subdirectory (except for
    main `dist/all.js`)
- Breaking change: For `undefined` and `sparseUndefined`, store as 0
    instead of `null` to save space; `revival` will be backward compatible
- Breaking change: Change from deprecated `@babel/polyfill` to
    `regenerator-runtime` and `core-js-bundle` (may have no impact
    since `@babel/polyfill` included them)
- Breaking change: Add `stack`, `fileName`, `lineNumber`, `columnNumber`, `cause`, and for `AggregateError`, `errors`
    and `name` to `errors` (default `name` can be changed after construction);
    also impacts `builtin`, `universal`, `postmessage`, and `socketio`

- Fix: Use new `Typeson.toStringTag` and `Typeson.hasConstructorOf` to
    get cross-frame/cross-module class detection (replacing `constructor`
    and `instanceof` checks)
- Fix (RegExp): Get `regexp` type to work properly with `multiline`
- Fix (RegExp): Add `unicode` and `sticky` flag support for cloning
- Fix (Date): Support invalid dates (with `NaN` value)
- Fix (undefined/sparseUndefined): Label `undefined` at root as regular
    `undef` type rather than `sparseUndefined` (will rely on update to
    `typeson`)
- Fix (SCA): Throw upon `Event` or `MessageChannel`
- Fix (SCA): Remove `Proxy` from list of structured clone throwing to throw
    as not available as such
- Fix (SCA): Ensure SCA can preserve arrays with non-index keys and
    support BigInts
- Fix (DataView): Get `dataview` to properly encode and decode `buffer`
    property
- Fix (ImageData): Get `imagedata` type to work properly (as `data` is not
    an array proper and length is on prototype, the object iteration
    will not preserve); fix by converting to array and reconstructing
    `Uint8ClampedArray` during revival)
- Fix (TypedArrays): For sake of TypedArrays, update to
    `base64-arraybuffer-es6`

- Enhancement (build): Adapt build processes for Rollup along with
    uglification and external source maps to represent code internally
    as ES6 Modules (and make for easy export to browser-usable ES6 modules)
- Enhancement: Add cloneable type with test (detects/utilizes
    `Symbol.for('cloneEncapsulate')` and `Symbol.for('cloneRevive')`
    methods on an object)
- Enhancement: Add resurrectable type with test (resurrects non-plain
    objects, functions, and symbols to the exact instance, assuming the
    same session/environment)
- Enhancement: Add `ImageBitmap` type (with sync and async revival)
- Enhancement: Add `File`, `Blob`, and `FileList` types (with sync and
    async replacement/encapsulation)
- Enhancement: Add new type `arrayNonindexKeys` for preserving non-index
    properties of arrays
- Enhancement: Add new types `bigint` and `bigintObject`
- Enhancement: Add `user-object` type and utilize in structured cloning
    to allow for non-plain user objects to be cloned; add test
- Enhancement: Add `nonbuiltin-ignore` type to roughly detect non-builtin
    objects and avoid adding them as properties
- Enhancement: Add `error` and `errors` to SCA
- Enhancement: Support `AggregateError` with `errors.js`
- Enhancement: Add `stack`, `fileName`, `lineNumber`, `columnNumber`,
    `cause`, and `errors` (for `AggregateError`)
    to `error` (changes representation, but less likely than `errors` to be
    breaking); fixes #10
- Enhancement (minor): Check `typeof` for functions in SCA since can avoid
    false positives

- Refactoring: Rely on now Typeson-built-in `isUserObject`
- Refactoring: Adjust to Typeson changes re: sparse arrays and `undefined`
- Refactoring: Use `test`/`replace`/`revive` object format for greater
    readability and possible extensibility
- Refactoring: Switch to ES6 Modules
- Refactoring: Use ESM for test and build files; change revived `FileList`
    to ES6 class instance; put `generateUUID` into shared utility file

- Linting: Add ESLint including npm script and apply
- Linting: Rename `.eslintrc` from deprecated bare form to have
    `.js` extension; lint Markdown JS; use ash-nazg config
- npm: Update dev/dependencies and remove shrinkwrap
- npm/ignore files: Add `node-canvas` testing dependency and ignore
    resulting build directory
- npm: Add `module` field (for bundlers as Webpack/Rollup)
- npm: Use `dist/all.js` for `main` in `package.json`
- npm: Remove `prepublish` script (being repeated on npm <= 4);
    add `engines` in anticipation of targeting specific version
- npm: Update `typeson`, `base64-arraybuffer-es6` deps
- npm: Change deprecated `opn-cli` -> `open-cli`; update and remove
    unused devDeps and `uuid`
- npm: Add `test:worker-open` script to open this test; rename
    `browser-test` to `test:browser`; add `test:browser-open`

- Building: Create `dist` directories if not existing
- Building: Package all types/presets into one (rolled-up/minified)
    file as well as to individual files
- Building: Minify and build source maps (preserving source files)
- Maintenance: Add `.editorconfig`

- Test building: Add Windows-specific routine for copying node-canvas DLLs
- Testing: Partial `URL.createObjectURL` polyfill
- Testing: Add browser testing support
- Testing: Make `Intl` locale result consistent
- Testing: Add `universal` preset tests
- Testing: Run built-in tests once with individual type(s) and once with
    the preset
- Testing: Add watch routine for CI development; add preliminary babelify
    routine to support more advanced features in test source (if not code)
- Testing: Add `ImageData` test that works in Node
- Testing: Split tests for `undefined`; add more checks
- Testing: Add tests for missing untested types
- Testing: Add a property and prototype property to simulated built in
    class
- Testing: Add user objects test; simplify non-built-in test
- Testing: Use static server to avoid Chrome origin restrictions
    when run on file system; auto-open test file
- Testing: Restore `undefined` at root
- Testing (Workers): Display results on HTML page
- Testing (Workers): Elaborate more on logging
- Testing (Update): JSDom API usage; overcome apparent Mocha change with
    deep equal, bump some timeouts, get working fully with in-browser test
- Testing (Refactoring): move utils into own file; avoid setting globals;
    create entry file without Canvas-specific code (problem when browserified)
- Testing (Refactoring): Consistent indentation and var. naming, reorder tests
    as present in built-in preset

- Demos: Remove redundant references to Typeson (already bundled with dist
    files)
- Docs (Code comment): imagedata no longer needs `arraybuffer.js` and can
    be shimmed in Node via `node-canvas`
- Docs (README): Demonstrate function revival (but indicate caveats and
    do not bundle)
- Docs (README): Indicate node-canvas build requirements for tests
- Docs (README): Add more info and usage notes for types and presets
- Docs (README): Document necessary polyfills for Node

## Version 1.0.0-alpha.2

- Fix (SCA): Structured cloning algorithm (SCA) should also throw upon
    encountering the `arguments` exotic object
- Fix (SCA): Prohibit `Object.prototype` as it is an exotic object and
    therefore per SCA ought to be rejected (though not forbidden currently
    in Chrome)
- Fix (SCA): Prevent final built-in non-array exotic object (`Module`)
    that should throw with SCA
- Fix (SCA): Throw upon DOM nodes (common non-built-in exotic? objects that
    cannot be cloned)
- Fix (ImageData): Check that `ImageData` is even defined; e.g., not in Node
    without node-canvas (it is not so critical, at least for structured cloning,
    to cause failures by its absence)
- Doc: Add to code comments re: exotic objects

## Version 1.0.0-alpha.1

- Enhancement (SCA): Add preliminary structured-cloning export with additional
    exception throwing checker (implemented as a typeson `test`)
- Enhancement (undefined/builtin): Add `undefined` type (overcomes JSON
    limitations representing `undefined`) and also add to `builtin` preset
- Enhancement (sparseUndefined): Add a new `sparseUndefined` type to allow
    rebuilding of sparse arrays (without explicit `undefined`)
- Refactoring: Adjust `undefined` behavior per new `typeson` behavior: ensure
    an explicit `undefined` will be added by reviver where justified
- Clean-up: Remove trailing WS, consistent semi-colon usage
- Clean-up: Make HTML proper HTML5 (and avoid browser messages)
- npm: Add authorship/contributors
- Testing: Add Structured Cloning tests (of both kinds)
- Testing: Add `undefined` and `sparseUndefined` tests (will require new
    published version of typeson)
- Docs: Fix typos in code comments
- Docs (README:) Fix headings (and use list style that doesn't trip up
    poor syntax highlighters which don't distinguish with bold)
