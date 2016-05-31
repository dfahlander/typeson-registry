# typeson-registry
The type registry for [typeson](https://github.com/dfahlander/typeson)

* Types listed under [types](https://github.com/dfahlander/typeson-registry/tree/master/types)
* Presets listed under [presets](https://github.com/dfahlander/typeson-registry/tree/master/presets)

# usage

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
# usage (with plain script tags)

This sample uses plain script tags. All types and presets under dist are UMD modules so you can require using requirejs as well.

```html
<!DOCTYPE html>
<html>
  <head>
    <script src="https://npmcdn.com/typeson/dist/typeson.js"></script>
    <script src="https://npmcdn.com/typeson-registry/dist/presets/builtin.js"></script>
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

# see also

* [typeson](https://github.com/dfahlander/typeson)
