# typeson-registry

The type registry for [typeson](https://github.com/dfahlander/typeson)

- Types listed under [types](https://github.com/dfahlander/typeson-registry/tree/master/types)
- Presets listed under [presets](https://github.com/dfahlander/typeson-registry/tree/master/presets)

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

## Development

[node-canvas](https://github.com/Automattic/node-canvas) is used to test `ImageData`.
Be sure to follow the installation steps. On Windows, besides following the [Windows installation steps](https://github.com/Automattic/node-canvas/wiki/Installation---Windows), [this](https://github.com/nodejs/node-gyp/issues/94#issuecomment-278587021)
and [this](https://github.com/Automattic/node-canvas/issues/191#issuecomment-7681555)
helped complete the installation.

## See also

- [typeson](https://github.com/dfahlander/typeson)
