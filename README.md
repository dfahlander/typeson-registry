# typeson-registry

The type registry for [typeson](https://github.com/dfahlander/typeson)

- Types listed under [types](https://github.com/dfahlander/typeson-registry/tree/master/types)
- Presets listed under [presets](https://github.com/dfahlander/typeson-registry/tree/master/presets)

See below for notes on these types and presets.

Note that some types will require polyfills in Node such as via [`jsdom`](https://github.com/tmpvar/jsdom/).
See the testing environment of `test/test.js` for some examples.

## Installation

You must run `npm run build` if you wish to get the individual browser scripts built locally (into `dist`)
(or in development to get `index.js` to be rebuilt based on existing presets and types).

## Usage

```js
var Typeson = require ('typeson');
var TSON = new Typeson().register([
    require('typeson-registry/types/date'),
    require('typeson-registry/types/error'),
    require('typeson-registry/types/regexp'),
    require('typeson-registry/types/typed-arrays'),
    // ...
]);

var tson = TSON.stringify({
    Hello: "world",
    date: new Date(),
    error: new Error(),
    inner: {
        x: /foo/ig,
        bin: new Uint8Array(64)
    }
}, null, 2);

console.log(tson);        
/* Output:

{
  "Hello": "world",
  "date": 1464049031538,
  "error": {
    "name": "Error",
    "message": ""
  },
  "inner": {
    "x": {
      "source": "foo",
      "flags": "gi"
    },
    "bin": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=="
  },
  "$types": {
    "date": "Date",
    "error": "Error",
    "inner.x": "RegExp",
    "inner.bin": "Uint8Array"
  }
}
*/

var parsedBack = TSON.parse(tson);

assert(parsedBack.date instanceof Date);
assert(parsedBack.inner.bin instanceof Uint8Array);

```

## Usage (with plain script tags)

All types and presets under dist are UMD modules so you could also require them as AMD modules with requirejs if you prefer.

```html
<!DOCTYPE html>
<html>
  <head>
    <script src="https://unpkg.com/typeson/dist/typeson.js"></script>
    <script src="https://unpkg.com/typeson-registry/dist/presets/builtin.js"></script>
    <script>

    var TSON = new Typeson().register(Typeson.presets.builtin);
    var tson = TSON.stringify({
        Hello: "world",
        date: new Date(),
        error: new Error(),
        inner: {
            x: /foo/ig,
            bin: new Uint8Array(64)
        }
    }, null, 2);

    alert(tson);        
    /* Alerts:

    {
      "Hello": "world",
      "date": 1464049031538,
      "error": {
        "name": "Error",
        "message": ""
      },
      "inner": {
        "x": {
          "source": "foo",
          "flags": "gi"
        },
        "bin": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=="
      },
      "$types": {
        "date": "Date",
        "error": "Error",
        "inner.x": "RegExp",
        "inner.bin": "Uint8Array"
      }
    }
    */

    </script>
  </head>
</html>
```

## Notes on types and presets

### Types

- `ArrayBuffer`
- `Blob` - Has sync and async encapsulation/replacements (though sync only
    via deprecated means)
- `cloneable` - Looks for `__cloneEncapsulate` and `__cloneRevive` methods to allow
    for a means of extending our built-in structured cloning presets (though if
    you are polyfilling a standard object, we welcome you to submit back as a
    PR!). The clones cannot be revived past the current window session, however.
- `DataView`
- `Date`
- `error.js` (`Error`) and `errors.js` (`TypeError`, `RangeError`, `SyntaxError`, `ReferenceError`, `EvalError`, `URIError`, `InternalError`) - These
    provide a means of resurrecting error object across cloning boundaries
    (since they are not otherwise treated as cloneable by the Structured
    Cloning Algorithm).
- `File` - Has sync and async encapsulation/replacements (though sync only
    via deprecated means)
- `FileList` - HTML does not provide a means of creating a `FileList` object
    dynamically, so we polyfill one for revival. This method also sets `File`
- `ImageBitmap` - Has sync and async revivers
- `ImageData`
- `intl-types.js` (`Intl.Collator`, `Intl.DateTimeFormat`, `Intl.NumberFormat`) -
    Not all properties can be preserved
- `Map`
- `nonBuiltInIgnore` - For roughly detecting non-builtin objects and to avoid
    adding them as properties
- `primitive-objects.js` (`StringObject`, `BooleanObject`, `NumberObject`)
- `RegExp`
- `resurrectable` - Resurrects any non-array object, function, or symbol; can
    only be revived for the current window session.
- `Set`
- `SpecialNumber` (preserves `NaN`, `Infinity`, `-Infinity`)
- `typed-arrays-socketio.js` (`Int8Array`, `Uint8Array`, `Uint8ClampedArray`, `Int16Array`, `Uint16Array`, `Int32Array`, `Uint32Array`, `Float32Array`, `Float64Array`) - See [typeson#environmentformat-support](https://github.com/dfahlander/typeson#environmentformat-support) and `presets/socketio.js`
- `typed-arrays.js` (`Int8Array`, `Uint8Array`, `Uint8ClampedArray`, `Int16Array`, `Uint16Array`, `Int32Array`, `Uint32Array`, `Float32Array`, `Float64Array`) - Base64-encodes
- `undefined` (See also `presets/undefined.js` and `presets/sparse-undefined.js`)
- `userObjects` - Allows for inherited objects but ensures the prototype chain
    inherits from `Object` (or `null`). Should be low priority if one is matching
    other objects as it will readily match many objects.

### Presets

- `builtin.js` - Types that are built into the JavaScript language itself. Types
    that were added in ES6 or beyond will be checked before inclusion
    so that this module can be consumed by both ES5 and ES6 environments. Some
    imperfectly serializable objects (such as functions and Symbols) are not included
    in this preset.
- `post-message.js` - This preset is intended as a utility to expand on what is
    cloneable via `strcutured-cloning.js` and supports Error objects.
- `sparse-undefined.js` (`sparseArrays` and `sparseUndefined`) - Supports
    reconstructing sparse arrays (with missing properties not even assigned
    an explicit `undefined`). See `types/undefined.js` for the explicit case or `presets/undefined.js` for a utility combining both.
- `structured-cloning.js` - For the Structured Cloning Algorithm used by the likes of `postMessage` and `indexedDB`. See also the `cloneable` type.
- `structured-cloning-throwing.js` - Same as `structured-cloning.js` but throws with non-recognized types. See also the `cloneable` type.
- `undefined.js` - Supports reconstructing explicit and implicit (sparse) uses of `undefined`.
- `universal.js`- Meant for de-facto universal types. Currently includes built-ins only.

### Functions (support not included)

If you are looking for a way to resurrect functions, you can use the following,
but please bear in mind that it uses `eval` which is prohibited by some
Content Security Policies (CSP) (so we are not packaging it with our builds),
that it is unsafe, and also that the function might not behave deterministically
when revived (e.g., if the function were provided from another context).

```js
var functionType = {functionType: [
    function (x) { return typeof x === 'function'; },
    function (functionType) { return '(' + functionType.toString() + ')'; },
    function (o) { return eval(o); }
]};

var typeson = new Typeson().register(functionType);
var tson = typeson.stringify(function () { return 'abc'; });
var back = typeson.parse(tson);
back() // 'abc'
```

## Development

[node-canvas](https://github.com/Automattic/node-canvas) is used to test `ImageData`.
Be sure to follow the installation steps.

On Windows, besides following the [Windows installation steps](https://github.com/Automattic/node-canvas/wiki/Installation---Windows), [this](https://github.com/nodejs/node-gyp/issues/94#issuecomment-278587021)
helped complete the installation. If you need to have it rebuilt, you can
run `npm i` inside of the `node_modules/canvas` directory.

[These steps](https://github.com/Automattic/node-canvas/issues/191#issuecomment-7681555)
were also necessary but you can run `npm run windows` after install to get these steps
applied. These are the only steps which should need to be re-run if you have deleted
your local `node-canvas` copy.

## See also

- [typeson](https://github.com/dfahlander/typeson)
