# typeson-registry
Official registry of typeson types and their encapsulation definitions.

* Types listed under `types`
* Presets listed under `presets`

# Usage

```js
var MyDefs = [
  require('typeson-registry/types/date'),
  require('typeson-registry/types/error'),
  require('typeson-registry/types/regexp'),
  require('typeson-registry/types/arraybuffer')
];
var Typeson = require ('typeson');

var TSON = new Typeson().register(MyDefs);

var json = TSON.stringify({Hello: "world", date: new Date(), error: new Error(), regexp: /foo/ig, binary: new Uint8Array(512)});

console.log(json);

var parsedBack = TSON.parse(json);

assert(parsedBack.date instanceof Date);
assert(parsedBack.binary instanceof Uint8Array);

```
