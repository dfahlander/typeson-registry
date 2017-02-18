# typeson-registry

The type registry for [typeson](https://github.com/dfahlander/typeson)

- Types listed under [types](https://github.com/dfahlander/typeson-registry/tree/master/types)
- Presets listed under [presets](https://github.com/dfahlander/typeson-registry/tree/master/presets)

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

## Functions

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
