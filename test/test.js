var assert = require('chai').assert,
    expect = require('chai').expect,
    Typeson = require('typeson'),
    arrayFrom = require('../utils/array-from-iterator'),
    Canvas = require('canvas');

global.ImageData = Canvas.ImageData; // Shim specific to Node

function Person (name, age, dob, isMarried) {
    name && (this.name = name);
    age && (this.age = age);
    dob && (this.dob = dob);
    isMarried && (this.isMarried = isMarried);
}
Person.prototype.name = '';
Person.prototype.age = 0;
Person.prototype.dob = new Date(1900, 0, 1);
Person.prototype.isMarried = false;

function SimulatedNonBuiltIn () {this.aaa = 5;}
SimulatedNonBuiltIn.prototype.bbb = 8;
SimulatedNonBuiltIn.prototype[Symbol.toStringTag] = 'SimulatedNonBuiltIn';

describe('Built-in', function() {
    describe('undefined type', function () {
        it('should be possible to restore `undefined` properties', function() {
            var typeson = new Typeson().register([
                require('../types/undefined')
            ]);
            var a = [undefined, {b: undefined, c: [3, null, , undefined]}];
            var json = typeson.stringify(a);
            var a2 = typeson.parse(json);
            expect(a2.length).to.equal(2);
            expect(a2[0]).to.equal(undefined);
            expect(a2[1].b).to.equal(undefined);
            expect(a2[1].c[1]).to.not.equal(undefined);
            expect(a2[1].c[2]).to.equal(undefined);
            expect(a2[1].c[3]).to.equal(undefined);

            expect('0' in a2).to.be.true;
            expect('b' in a2[1]).to.be.true;
            expect('1' in a2[1].c).to.be.true;
            expect('2' in a2[1].c).to.be.false;
            expect('3' in a2[1].c).to.be.true;
        });
        it('should be possible to restore `undefined` at root', function() {
            var typeson = new Typeson().register([
                require('../types/undefined')
            ]);
            var tson = typeson.stringify(undefined);
            expect(tson).to.equal('{"$":null,"$types":{"$":{"":"undefined"}}}');
            var back = typeson.parse(tson);
            expect(back).to.be.undefined;
        });
    });

    describe('Primitive objects', function () {
        it('String object', function () {
            var typeson = new Typeson().register(require('../types/primitive-objects'));
            var strObj = new String('hello');
            var tson = typeson.stringify(strObj, null, 2);
            var back = typeson.parse(tson);
            expect(back).to.be.an.instanceOf(String);
            expect(back.valueOf()).to.equal('hello');
            expect(back.length).to.equal(5);
        });
        it('Boolean object', function () {
            var typeson = new Typeson().register(require('../types/primitive-objects'));
            var strObj = new Boolean(true);
            var tson = typeson.stringify(strObj, null, 2);
            var back = typeson.parse(tson);
            expect(back).to.be.an.instanceOf(Boolean);
            expect(back.valueOf()).to.equal(true);
        });
        it('Number object', function () {
            var typeson = new Typeson().register(require('../types/primitive-objects'));
            var strObj = new Number(456);
            var tson = typeson.stringify(strObj, null, 2);
            var back = typeson.parse(tson);
            expect(back).to.be.an.instanceOf(Number);
            expect(back.valueOf()).to.equal(456);
        });
    });

    describe('Special numbers', function () {
        it('NaN', function () {
            var typeson = new Typeson().register(require('../types/special-numbers'));
            var tson = typeson.stringify(NaN, null, 2);
            var back = typeson.parse(tson);
            expect(back).to.be.NaN;
        });
        it('Infinity', function () {
            var typeson = new Typeson().register(require('../types/special-numbers'));
            var tson = typeson.stringify(Infinity, null, 2);
            var back = typeson.parse(tson);
            expect(back).to.equal(Infinity);
        });
        it('-Infinity', function () {
            var typeson = new Typeson().register(require('../types/special-numbers'));
            var tson = typeson.stringify(-Infinity, null, 2);
            var back = typeson.parse(tson);
            expect(back).to.equal(-Infinity);
        });
        it('should not mistake string forms of the special numbers', function () {
            var typeson = new Typeson().register(require('../types/special-numbers'));
            var tson = typeson.stringify('NaN', null, 2);
            var back = typeson.parse(tson);
            expect(back).to.equal('NaN');
            var tson = typeson.stringify('Infinity', null, 2);
            var back = typeson.parse(tson);
            expect(back).to.equal('Infinity');
            var tson = typeson.stringify('-Infinity', null, 2);
            var back = typeson.parse(tson);
            expect(back).to.equal('-Infinity');
        });
        it('should not disturb encoding of normal numbers', function () {
            var typeson = new Typeson().register(require('../types/special-numbers'));
            var tson = typeson.stringify(512, null, 2);
            var back = typeson.parse(tson);
            expect(back).to.equal(512);
        });
    });

    describe('Date', function () {
        it('should get back a real Date instance with the original time milliseconds', function () {
            var typeson = new Typeson().register(require('../types/date'));
            var json = typeson.stringify(new Date(1234567));
            var obj = typeson.parse(json);
            expect(obj).to.be.an.instanceOf(Date);
            expect(obj.getTime()).to.equal(1234567);
        });
    });

    describe('Error and Errors', function () {
        it('should get back real Error instances corresponding to their types and with the original name and message', function () {
            var typeson = new Typeson().register([require('../types/error'), require('../types/errors.js')]);
            var json = typeson.stringify({
                e1: new Error("Error1"),
                e2: new TypeError("Error2"),
                e3: new RangeError("Error3"),
                e4: new SyntaxError("Error4"),
                e5: new ReferenceError("Error5")
            });
            var obj = typeson.parse(json);
            expect(obj.e1).to.be.an.instanceOf(Error);
            expect(obj.e1.name).to.equal("Error");
            expect(obj.e2).to.be.an.instanceOf(TypeError);
            expect(obj.e2.name).to.equal("TypeError");
            expect(obj.e3).to.be.an.instanceOf(RangeError);
            expect(obj.e3.name).to.equal("RangeError");
            expect(obj.e4).to.be.an.instanceOf(SyntaxError);
            expect(obj.e4.name).to.equal("SyntaxError");
            expect(obj.e5).to.be.an.instanceOf(ReferenceError);
            expect(obj.e5.name).to.equal("ReferenceError");
        });
    });

    describe('RegExp', function () {
        it('should return a RegExp', function () {
            var typeson = new Typeson().register([
                require('../types/regexp')
            ]);
            var regex = new RegExp('ab?c', 'g');
            var tson = typeson.stringify(regex, null, 2);
            var back = typeson.parse(tson);
            expect(back instanceof RegExp);
            expect(back.global).to.equal(true);
            expect(back.ignoreCase).to.equal(false);
            expect(back.multiline).to.equal(false);
            expect(back.source).to.equal('ab?c');

            var regex = /ab?c/im;
            var tson = typeson.stringify(regex, null, 2);
            var back = typeson.parse(tson);
            expect(back instanceof RegExp);
            expect(back.global).to.equal(false);
            expect(back.ignoreCase).to.equal(true);
            expect(back.multiline).to.equal(true);
            expect(back.source).to.equal('ab?c');
        });
    });

    describe('Map', function () {
        it('should get back a real Map instance with the original data and use complex types also in contained items', function () {
            var typeson = new Typeson().register(require('../presets/builtin'));
            var map = new Map();
            var error = new Error("Error here"),
                date = new Date(10000);

            map.set(error, date);
            var json = typeson.stringify({m: map});
            var obj = typeson.parse(json);
            expect(obj.m).to.be.an.instanceOf(Map);
            expect(arrayFrom(obj.m.keys())[0]).to.be.an.instanceOf(Error);
            expect(arrayFrom(obj.m.values())[0]).to.be.an.instanceOf(Date);
        });
    });

    describe('Set', function () {
        it('should get back a real Set instance with the original data and use complex types also in contained items', function () {
            var typeson = new Typeson().register(require('../presets/builtin'));
            var set = new Set();
            var error = new Error("Error here"),
                date = new Date(10000),
                str = "",
                o = {
                    a: error
                };

            set.add(o);
            set.add(date);
            set.add(str);

            var json = typeson.stringify({s: set});
            var obj = typeson.parse(json);

            expect(obj.s).to.be.an.instanceOf(Set);

            var a = arrayFrom(obj.s.values());
            expect(a[0].a).to.be.an.instanceOf(Error);
            expect(a[1]).to.be.an.instanceOf(Date);
            expect(a[2]).to.be.a('string');
        });
    });

    describe('ArrayBuffer', function () {
        it('should return an ArrayBuffer', function () {
            var typeson = new Typeson().register([
                require('../types/arraybuffer')
            ]);
            var buf = new ArrayBuffer(16);
            var tson = typeson.stringify(buf, null, 2);
            var back = typeson.parse(tson);
            expect(back instanceof ArrayBuffer);
            expect(back.byteLength).to.equal(16);
        });
    });

    describe('TypedArrays', function(){
        describe('Float64Array', function() {
            it('should get back real Float64Array instance with original array content', function () {
                var typeson = new Typeson().register([
                    require('../types/arraybuffer'),
                    require('../types/typed-arrays')
                ]);
                var a = new Float64Array(3);
                a[0] = 23.8;
                a[1] = -15;
                a[2] = 99;
                var json = typeson.stringify({a: a});
                var obj = typeson.parse(json);
                expect(obj.a).to.be.an.instanceOf(Float64Array);
                expect(obj.a.length).to.equal(3);
                expect(obj.a[0]).to.equal(23.8);
                expect(obj.a[1]).to.equal(-15);
                expect(obj.a[2]).to.equal(99);
            });
        });

        describe('Uint16 arrays over invalid unicode range', function() {
            it('should work to use any 16-bit number no matter whether it is invalid unicode or not', function(){
                var typeson = new Typeson().register([
                    require('../types/arraybuffer'),
                    require('../types/typed-arrays')
                ]);
                var a = new Uint16Array(0x0900),
                    i = a.length;
                while (i--) a[i] = i + 0xd780;
                var json = typeson.stringify({a: a});
                //console.log(json);

                // Emulate a textencoder that eliminates invalid UTF chars
                i = json.length;
                var copy = new Uint16Array(i);
                while (i--) {
                    var ch = json.charCodeAt(i);
                    copy[i] = ch >= 0xd800 && ch < 0xe000 ? 0xfffd : ch;
                }
                json = String.fromCharCode.apply(null, copy);

                var obj = typeson.parse(json);
                expect(obj.a).to.be.an.instanceOf(Uint16Array);
                expect(obj.a.length).to.equal(a.length);
                obj.a.forEach(function (x, i) {
                    expect(x).to.equal(i + 0xd780);
                });
            });
        });

        describe('Int8 arrays with odd length', function () {
            it('should be possible to use an odd length of an Int8Array', function() {
                var typeson = new Typeson().register([
                    require('../types/arraybuffer'),
                    require('../types/typed-arrays')
                ]);
                var a = new Int8Array(3);
                a[0] = 0;
                a[1] = 1;
                a[2] = 2;
                var json = typeson.stringify(a);
                // console.log(json);
                var a2 = typeson.parse(json);
                expect(a2.length).to.equal(3);
                expect(a2[0]).to.equal(0);
                expect(a2[1]).to.equal(1);
                expect(a2[2]).to.equal(2);
            });
        });
    });

    describe('DataView', function () {
        it('should return a DataView', function () {
            var typeson = new Typeson().register([
                require('../types/dataview')
            ]);
            var sample = [0x44, 0x33, 0x22, 0x11, 0xFF, 0xEE, 0xDD, 0xCC];
            var buffer = new Uint8Array(sample).buffer;
            var dataView = new DataView(buffer, 3, 4);
            expect(dataView.byteLength).to.equal(4);
            var tson = typeson.stringify(dataView, null, 2);
            var back = typeson.parse(tson);
            expect(back).to.be.an.instanceOf(DataView);
            expect(back.byteLength).to.equal(4);
        });
    });

    describe('Intl types', function () {
        it('should return a Intl.Collator', function () {
            var typeson = new Typeson().register([
                require('../types/intl-types')
            ]);
            // After `-u-`, the values don't appear to be validated in Node or Chrome
            var locales = ['hi', 'de-AT', 'de-DE-u-co-phonebk', 'en-US-u-kn-true', 'en-US-u-kf-upper'];
            var opts = {
                localeMatcher: 'lookup',
                usage: 'search',
                sensitivity: 'base',
                ignorePunctuation: true,
                numeric: true,
                caseFirst: 'upper'
            };
            var optsClone = JSON.parse(JSON.stringify(opts));

            var collator = new Intl.Collator(locales, opts);
            var tson = typeson.stringify(collator, null, 2);
            var back = typeson.parse(tson);
            expect(back instanceof Intl.Collator);
            // console.log(Intl.Collator.supportedLocalesOf(Object.keys(optsClone.locales), optsClone.localeMatcher));

            expect(back.resolvedOptions().locale).to.deep.equal('en-u-co-search');
            Object.keys(optsClone).filter(
                (k) => ![
                    // These would ideally be present but are not available for inspection
                    'localeMatcher', 'locales'
                ].includes(k)
            ).forEach((prop) => {
                expect(back.resolvedOptions()[prop]).to.deep.equal(optsClone[prop]);
            });
        });
        it('should return a Intl.DateTimeFormat', function () {
            var typeson = new Typeson().register([
                require('../types/intl-types')
            ]);
            var locales = ['hi', 'de-AT', 'de-DE-u-nu-latn', 'en-US-u-ca-persian'];
            var opts = {
                localeMatcher: 'lookup',
                timeZone: 'Asia/Shanghai',
                hour12: false,
                formatMatcher: 'basic'
            };
            optsClone = JSON.parse(JSON.stringify(opts));

            var dtf = new Intl.DateTimeFormat(locales, opts);
            var tson = typeson.stringify(dtf, null, 2);
            var back = typeson.parse(tson);
            expect(back instanceof Intl.DateTimeFormat);
            Object.keys(optsClone).filter(
                (k) => ![
                    // These would ideally be present but are not available for inspection
                    'localeMatcher', 'locales', 'formatMatcher',
                    'hour12' // Not currently working in Node or Chrome
                ].includes(k)
            ).forEach((prop) => {
                expect(back.resolvedOptions()[prop]).to.deep.equal(optsClone[prop]);
            });
        });
        it('should return a Intl.NumberFormat', function () {
            var typeson = new Typeson().register([
                require('../types/intl-types')
            ]);
            var typeson = new Typeson().register([
                require('../types/intl-types')
            ]);
            var locales = ['hi', 'de-AT', 'de-DE-u-nu-bali'];
            var opts = {
                localeMatcher: 'lookup',
                style: 'currency',
                currency: 'EUR',
                currencyDisplay: 'symbol',
                useGrouping: false
            };
            optsClone = JSON.parse(JSON.stringify(opts));

            var dtf = new Intl.NumberFormat(locales, opts);
            var tson = typeson.stringify(dtf, null, 2);
            var back = typeson.parse(tson);
            expect(back instanceof Intl.NumberFormat);
            Object.keys(optsClone).filter(
                (k) => ![
                    // These would ideally be present but are not available for inspection
                    'localeMatcher', 'locales'
                ].includes(k)
            ).forEach((prop) => {
                expect(back.resolvedOptions()[prop]).to.deep.equal(optsClone[prop]);
            });
        });
    });
});

describe('ImageData', function () {
    it('should get back an ImageData instance with the original data', function () {
        var typeson = new Typeson().register([
            require('../types/imagedata')
        ]);
        var imageData = new ImageData(1, 3);
        var tson = typeson.stringify(imageData);
        var back = typeson.parse(tson);
        expect(back).to.deep.equal({
            width: 1, height: 3, data: new Uint8ClampedArray(12)
        });
    });
});

describe('Non-built-in object ignoring', function () {
    it('should ignore non-built-in objects (simulated)', function () {
        var typeson = new Typeson().register([
            require('../types/nonbuiltin-ignore')
        ]);
        var john = new Person('John Doe');
        var simulatedNonBuiltInObject = new SimulatedNonBuiltIn();
        var tson = typeson.stringify({a: john, b: simulatedNonBuiltInObject});
        var back = typeson.parse(tson);
        expect(back).to.deep.equal({
            a: {name: 'John Doe'}
        });
        var a = typeson.encapsulate(['a', simulatedNonBuiltInObject, 5, null]);
        expect('0' in a).to.be.true;
        expect('1' in a).to.be.false;
        expect('2' in a).to.be.true;
        expect('3' in a).to.be.true;
    });
});

describe('User objects', function () {
    it('should do recursive type checking on user instantiated objects', function () {
        var typeson = new Typeson()
             .register([require('../types/user-object'), require('../types/date')]);
        var bob = new Person('Bob Smith', 30, new Date(2000, 5, 20), true);

        var simulatedNonBuiltInObject = new SimulatedNonBuiltIn();
        simulatedNonBuiltInObject.prop = 500;
        var tson = typeson.stringify({a: bob, b: simulatedNonBuiltInObject});
        var back = typeson.parse(tson);
        expect(back).to.deep.equal({
            a: {name: 'Bob Smith', age: 30, dob: new Date(2000, 5, 20), isMarried: true},
            b: {aaa: 5, prop: 500}
        });
        expect('dob' in back.a).to.be.true;
    });
    it('should work with nonbuiltin-ignore', function () {
        var typeson = new Typeson().register([
            require('../types/user-object'),
            require('../types/nonbuiltin-ignore')
        ]);
        var bob = new Person('Bob Smith', 30, new Date(2000, 5, 20), true);
        var simulatedNonBuiltInObject = new SimulatedNonBuiltIn();
        var tson = typeson.stringify({a: bob, b: simulatedNonBuiltInObject});
        var back = typeson.parse(tson);
        expect(back).to.deep.equal({
            a: {name: 'Bob Smith', age: 30, isMarried: true}
        });
        expect('dob' in back.a).to.be.false;
    });
});

describe('Structured cloning', function () {
    it('should work with Structured cloning with throwing', function () {
        var typeson = new Typeson().register([require('../presets/structured-cloning-throwing')]);
        var caught = false;
        try {
            typeson.stringify(new Error('test'));
        } catch (err) {
            caught = true;
        }
        assert(caught, 'Caught error');
        var expected = '{"$":1234567890000,"$types":{"$":{"":"Date"}}}';
        var result = typeson.stringify(new Date(1234567890000));
        expect(result).to.deep.equal(expected);
    });
    it('should work with Structured cloning without throwing', function () {
        var typeson = new Typeson().register([require('../presets/structured-cloning')]);
        var caught = false;
        try {
            typeson.stringify(new Error('test'));
        } catch (err) {
            console.log(err);
            caught = true;
        }
        assert(!caught, 'Did not catch error');
        var expected = '{"$":1234567890000,"$types":{"$":{"":"Date"}}}';
        var result = typeson.stringify(new Date(1234567890000));
        expect(result).to.deep.equal(expected);
    });
    it('should allow recursive type checking on user instantiated objects', function () {
        var typeson = new Typeson().register([require('../presets/structured-cloning')]);
        var john = new Person('John Doe');
        var bob = new Person('Bob Smith', 30, new Date(2000, 5, 20), true);

        var clonedData = typeson.parse(typeson.stringify([john, bob]));
        expect(clonedData).to.have.same.deep.members([
            {name: 'John Doe'},
            {name: 'Bob Smith', dob: new Date(2000, 5, 20), age: 30, isMarried: true}
        ]);
    });
});
