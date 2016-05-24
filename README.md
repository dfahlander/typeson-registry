# typeson-registry
Official registry of typeson types and their encapsulation definitions.

* Types listed under `types`
* Presets listed under `presets`

# Usage

```js
var Typeson = require ('typeson');

var TSON = new Typeson().register([
  require('typeson-registry/types/date'),
  require('typeson-registry/types/error'),
  require('typeson-registry/types/regexp'),
  require('typeson-registry/types/arraybuffer')
]);

var tson = TSON.stringify({Hello: "world", date: new Date(), error: new Error(), regexp: /foo/ig, binary: new Uint8Array(512)});

console.log(tson);

var parsedBack = TSON.parse(tson);

assert(parsedBack.date instanceof Date);
assert(parsedBack.binary instanceof Uint8Array);

```
