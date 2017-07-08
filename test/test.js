function BuiltIn (preset) {
    describe('undefined type', function () {
        it('should be possible to restore `undefined` properties', function() {
            var typeson = new Typeson().register(
                preset || require('../types/undefined')
            );
            var a = [undefined, {b: undefined, c: [3, null, , undefined]}];
            var json = typeson.stringify(a);
            var a2 = typeson.parse(json);
            expect(a2.length).to.equal(2);
            expect(a2[0]).to.equal(undefined);
            expect(a2[1].b).to.equal(undefined);
            expect(a2[1].c[1]).to.not.equal(undefined);
            expect(a2[1].c[3]).to.equal(undefined);

            expect('0' in a2).to.be.true;
            expect('b' in a2[1]).to.be.true;
            expect('1' in a2[1].c).to.be.true;
            expect('3' in a2[1].c).to.be.true;

            if (preset) { // Includes sparse-undefined preset too
                expect(a2[1].c[2]).to.equal(undefined);
                expect('2' in a2[1].c).to.be.false;
            } else {
                expect(a2[1].c[2]).to.not.equal(undefined);
                expect('2' in a2[1].c).to.be.true;
            }
        });
        it('should be possible to restore `undefined` at root', function() {
            var typeson = new Typeson().register(
                preset || require('../types/undefined')
            );
            var tson = typeson.stringify(undefined);
            expect(tson).to.equal('{"$":null,"$types":{"$":{"":"undefined"}}}');
            var back = typeson.parse(tson);
            expect(back).to.be.undefined;
        });
    });

    describe('Primitive objects', function () {
        it('String object', function () {
            var typeson = new Typeson().register(preset || require('../types/primitive-objects'));
            var strObj = new String('hello');
            var tson = typeson.stringify(strObj, null, 2);
            var back = typeson.parse(tson);
            expect(back).to.be.an.instanceOf(String);
            expect(back.valueOf()).to.equal('hello');
            expect(back.length).to.equal(5);
        });
        it('Boolean object', function () {
            var typeson = new Typeson().register(preset || require('../types/primitive-objects'));
            var strObj = new Boolean(true);
            var tson = typeson.stringify(strObj, null, 2);
            var back = typeson.parse(tson);
            expect(back).to.be.an.instanceOf(Boolean);
            expect(back.valueOf()).to.equal(true);
        });
        it('Number object', function () {
            var typeson = new Typeson().register(preset || require('../types/primitive-objects'));
            var strObj = new Number(456);
            var tson = typeson.stringify(strObj, null, 2);
            var back = typeson.parse(tson);
            expect(back).to.be.an.instanceOf(Number);
            expect(back.valueOf()).to.equal(456);
        });
    });

    describe('Special numbers', function () {
        it('NaN', function () {
            var typeson = new Typeson().register(preset || require('../presets/special-numbers'));
            var tson = typeson.stringify(NaN, null, 2);
            var back = typeson.parse(tson);
            expect(back).to.be.NaN;
        });
        it('Infinity', function () {
            var typeson = new Typeson().register(preset || require('../presets/special-numbers'));
            var tson = typeson.stringify(Infinity, null, 2);
            var back = typeson.parse(tson);
            expect(back).to.equal(Infinity);
        });
        it('-Infinity', function () {
            var typeson = new Typeson().register(preset || require('../presets/special-numbers'));
            var tson = typeson.stringify(-Infinity, null, 2);
            var back = typeson.parse(tson);
            expect(back).to.equal(-Infinity);
        });
        it('should not mistake string forms of the special numbers', function () {
            var typeson = new Typeson().register(preset || require('../presets/special-numbers'));
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
            var typeson = new Typeson().register(preset || require('../presets/special-numbers'));
            var tson = typeson.stringify(512, null, 2);
            var back = typeson.parse(tson);
            expect(back).to.equal(512);
        });
    });

    describe('Date', function () {
        it('should get back a real Date instance with the original time milliseconds', function () {
            var typeson = new Typeson().register(preset || require('../types/date'));
            var json = typeson.stringify(new Date(1234567));
            var obj = typeson.parse(json);
            expect(obj).to.be.an.instanceOf(Date);
            expect(obj.getTime()).to.equal(1234567);
        });
        it('should get back a real invalid Date instance', function () {
            var typeson = new Typeson().register(preset || require('../types/date'));
            var json = typeson.stringify(new Date(NaN));
            var obj = typeson.parse(json);
            expect(obj).to.be.an.instanceOf(Date);
            expect(obj.getTime()).to.be.NaN;
        });
    });

    describe('Error and Errors', function () {
        it('should get back real Error instances corresponding to their types and with the original name and message', function () {
            var typeson = new Typeson().register(preset || [require('../types/error'), require('../types/errors')]);
            var json = typeson.stringify({
                e1: new Error("Error1"),
                e2: new TypeError("Error2"),
                e3: new RangeError("Error3"),
                e4: new SyntaxError("Error4"),
                e5: new ReferenceError("Error5")
                // , e6: new InternalError("Error6")
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
            // Non-standard
            // expect(obj.e6).to.be.an.instanceOf(InternalError);
            // expect(obj.e6.name).to.equal("InternalError");
        });
    });

    describe('RegExp', function () {
        it('should return a RegExp', function () {
            var typeson = new Typeson().register(preset || [
                require('../types/regexp')
            ]);
            var regex = new RegExp('ab?c', 'guy');
            var tson = typeson.stringify(regex, null, 2);
            var back = typeson.parse(tson);
            expect(back instanceof RegExp);
            expect(back.global).to.equal(true);
            expect(back.unicode).to.equal(true);
            expect(back.sticky).to.equal(true);
            expect(back.ignoreCase).to.equal(false);
            expect(back.multiline).to.equal(false);
            expect(back.source).to.equal('ab?c');

            var regex = /ab?c/im;
            var tson = typeson.stringify(regex, null, 2);
            var back = typeson.parse(tson);
            expect(back instanceof RegExp);
            expect(back.global).to.equal(false);
            expect(back.unicode).to.equal(false);
            expect(back.sticky).to.equal(false);
            expect(back.ignoreCase).to.equal(true);
            expect(back.multiline).to.equal(true);
            expect(back.source).to.equal('ab?c');
        });
    });

    describe('Map', function () {
        it('should get back a real Map instance with the original data and use complex types also in contained items', function () {
            var typeson = new Typeson().register(preset || require('../types/map'));
            var map = new Map();
            var error = new Error("Error here"),
                date = new Date(10000);

            map.set(error, date);
            var json = typeson.stringify({m: map});
            var obj = typeson.parse(json);
            expect(obj.m).to.be.an.instanceOf(Map);
            if (preset) {
                expect(Array.from(obj.m.keys())[0]).to.be.an.instanceOf(Error);
                expect(Array.from(obj.m.values())[0]).to.be.an.instanceOf(Date);
            }
        });
    });

    describe('Set', function () {
        it('should get back a real Set instance with the original data and use complex types also in contained items', function () {
            var typeson = new Typeson().register(preset || require('../types/set'));
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

            var a = Array.from(obj.s.values());
            if (preset) {
                expect(a[0].a).to.be.an.instanceOf(Error);
                expect(a[1]).to.be.an.instanceOf(Date);
            }
            expect(a[2]).to.be.a('string');
        });
    });

    describe('ArrayBuffer', function () {
        it('should return an ArrayBuffer', function () {
            var typeson = new Typeson().register(preset || [
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
                var typeson = new Typeson().register(preset || [
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
                var typeson = new Typeson().register(preset || [
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
                var typeson = new Typeson().register(preset || [
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

    /*
    // TODO: Add for typed-arrays-socketio
    describe('TypedArrays Socket-IO', function () {
    });
    */

    describe('DataView', function () {
        it('should return a DataView', function () {
            var typeson = new Typeson().register(preset || [
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
            var typeson = new Typeson().register(preset || [
                require('../types/intl-types')
            ]);
            // After `-u-`, the values don't appear to be validated in Node or Chrome
            var locales = ['en', 'hi', 'de-AT', 'de-DE-u-co-phonebk', 'en-US-u-kn-true', 'en-US-u-kf-upper'];
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
            var typeson = new Typeson().register(preset || [
                require('../types/intl-types')
            ]);
            var locales = ['hi', 'de-AT', 'de-DE-u-nu-latn', 'en-US-u-ca-persian'];
            var opts = {
                localeMatcher: 'lookup',
                timeZone: 'Asia/Shanghai',
                hour12: false,
                formatMatcher: 'basic'
            };
            var optsClone = JSON.parse(JSON.stringify(opts));

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
            var typeson = new Typeson().register(preset || [
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
            var optsClone = JSON.parse(JSON.stringify(opts));

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
}

describe('Built-in', BuiltIn);

describe('ImageData', function () {
    it('should get back an ImageData instance with the original data', function () {
        var typeson = new Typeson().register(
            require('../types/imagedata')
        );
        var imageData = new ImageData(1, 3);
        var tson = typeson.stringify(imageData);
        var back = typeson.parse(tson);
        expect(back.width).to.equal(1);
        expect(back.height).to.equal(3);
        expect(back.data).to.deep.equal(new Uint8ClampedArray(12));
    });
});

describe('ImageBitmap', function () {
    it('should get back an ImageBitmap instance with the original data', function (done) {
        var typeson = new Typeson().register(
            require('../types/imagebitmap')
        );

        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        var img = document.createElement('img');
        // The onload is needed by some browsers per http://stackoverflow.com/a/4776378/271577
        img.onload = function () {
            ctx.drawImage(img, 0, 0);

            createImageBitmap(canvas).then(function (imageBitmap) {
                var tson = typeson.stringify(imageBitmap);
                return typeson.parse(tson);
            }).then(function (back) {
                expect(back.width).to.equal(300 /* img.width */);
                expect(back.height).to.equal(150 /* img.height */);

                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');
                ctx.drawImage(back, 0, 0);
                // Not getting a URL that is displaying properly or exactly consistent between Node/browser
                try {
                    expect(canvas.toDataURL()).to.equal('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACWCAYAAABkW7XSAAAABmJLR0QA/wD/AP+gvaeTAAACC0lEQVR4nO3UQQ3AIADAwDF7uMMeYpiF/UiTOwV9dcy1zwMQ8N4OAPjLsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwg4wMLwgPj2swUCwAAAABJRU5ErkJggg=='
                    );
                } catch (err) {
                    expect(canvas.toDataURL()).to.equal('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACWCAYAAABkW7XSAAAEYklEQVR4Xu3UAQkAAAwCwdm/9HI83BLIOdw5AgQIRAQWySkmAQIEzmB5AgIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlACBB1YxAJfjJb2jAAAAAElFTkSuQmCC');
                }
                done();
            });
        };
        // Didn't work with a relative path nor with an SVG file in node-canvas
        img.src = typeof imageTestFileNode !== 'undefined' ? imageTestFileNode : '../test/Flag_of_the_United_Nations.png'; // browserify-test uses testem which assumes cwd() resolution (in `Config.prototype.resolvePath` of `node_modules/testem/lib/config.js`)
    });
    it('should get back an ImageBitmap instance with the original data asynchronously', function (done) {
        var typeson = new Typeson().register(
            require('../types/imagebitmap')
        );

        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        var img = document.createElement('img');
        // The onload is needed by some browsers per http://stackoverflow.com/a/4776378/271577
        img.onload = function () {
            ctx.drawImage(img, 0, 0);

            createImageBitmap(canvas).then(function (imageBitmap) {
                var tson = typeson.stringify(imageBitmap);
                return typeson.parseAsync(tson);
            }).then(function (back) {
                expect(back.width).to.equal(300); // img.width
                expect(back.height).to.equal(150); // img.height

                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');
                ctx.drawImage(back, 0, 0);
                // Not getting a URL that is displaying properly or exactly consistent between Node/browser
                try {
                    expect(canvas.toDataURL()).to.equal('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACWCAYAAABkW7XSAAAABmJLR0QA/wD/AP+gvaeTAAACC0lEQVR4nO3UQQ3AIADAwDF7uMMeYpiF/UiTOwV9dcy1zwMQ8N4OAPjLsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwg4wMLwgPj2swUCwAAAABJRU5ErkJggg=='
                    );
                } catch (err) {
                    expect(canvas.toDataURL()).to.equal('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACWCAYAAABkW7XSAAAEYklEQVR4Xu3UAQkAAAwCwdm/9HI83BLIOdw5AgQIRAQWySkmAQIEzmB5AgIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlACBB1YxAJfjJb2jAAAAAElFTkSuQmCC');
                }
                done();
            });
        };
        // Didn't work with a relative path nor with an SVG file in node-canvas
        img.src = typeof imageTestFileNode !== 'undefined' ? imageTestFileNode : '../test/Flag_of_the_United_Nations.png'; // browserify-test uses testem which assumes cwd() resolution (in `Config.prototype.resolvePath` of `node_modules/testem/lib/config.js`)
    });
});

describe('Blob', function () {
    it('should get back a Blob instance with the original data', function (done) {
        this.timeout(10000);
        var typeson = new Typeson().register(
            require('../types/blob')
        );
        var currTime = new Date();
        var contentType = 'application/json';
        var stringContents = JSON.stringify('abc\u1234');

        var blob = new Blob([
            // BufferSource (ArrayBufferView (Int8Array, etc. or DataView) or ArrayBuffer), Blob, or USVString (strings without unpaired surrogates)
            stringContents
        ],
        {
            type: contentType // DOMString
        });
        var tson = typeson.stringify(blob);
        var back = typeson.parse(tson);
        expect(back.type).to.equal(contentType);
        expect('name' in back).to.be.false; // No file properties
        expect('lastModified' in back).to.be.false; // No file properties
        var reader = new FileReader();
        reader.addEventListener('load', function () {
            expect(reader.result).to.equal(stringContents);
            done();
        });
        reader.addEventListener('error', function () {
            assert(false, "FileReader should not err");
        });
        reader.readAsText(back);
    });
    it('should get back a Blob instance with the original data asynchronously', function (done) {
        var typeson = new Typeson().register(
            require('../types/blob')
        );
        var currTime = new Date();
        var contentType = 'application/json';
        var stringContents = JSON.stringify('abc\u1234');

        var blob = new Blob([
            // BufferSource (ArrayBufferView (Int8Array, etc. or DataView) or ArrayBuffer), Blob, or USVString (strings without unpaired surrogates)
            stringContents
        ],
        {
            type: contentType // DOMString
        });
        typeson.stringifyAsync(blob).then(function (tson) {
            var back = typeson.parse(tson);
            expect(back.type).to.equal(contentType);
            expect('name' in back).to.be.false; // No file properties
            expect('lastModified' in back).to.be.false; // No file properties
            var reader = new FileReader();
            reader.addEventListener('load', function () {
                expect(reader.result).to.equal(stringContents);
                done();
            });
            reader.addEventListener('error', function () {
                assert(false, "FileReader should not err");
            });
            reader.readAsText(back);
        });
    });
});

describe('File', function () {
    this.timeout(10000);
    it('should get back a File instance with the original data', function (done) {
        var typeson = new Typeson().register(
            require('../types/file')
        );
        var currTime = new Date();
        var contentType = 'application/json';
        var fileName = 'aName';
        var stringContents = JSON.stringify('abc\u1234');
        var file = new File([
            // BufferSource (ArrayBufferView (Int8Array, etc. or DataView) or ArrayBuffer), Blob, or USVString (strings without unpaired surrogates)
            stringContents
        ],
        fileName, // USVString (strings without unpaired surrogates)
        {
            type: contentType, // DOMString
            lastModified: currTime // Or number
        });
        var tson = typeson.stringify(file);
        var back = typeson.parse(tson);
        expect(back.lastModified).to.equal(currTime.getTime());
        expect(back.type).to.equal(contentType);
        expect(back.name).to.equal(fileName);
        var reader = new FileReader();
        reader.addEventListener('load', function () {
            expect(reader.result).to.equal(stringContents);
            done();
        });
        reader.addEventListener('error', function () {
            assert(false, "FileReader should not err");
        });
        reader.readAsText(back);
    });
    it('should get back a File instance with the original data asynchronously', function (done) {
        var typeson = new Typeson().register(
            require('../types/file')
        );
        var currTime = new Date();
        var contentType = 'application/json';
        var fileName = 'aName';
        var stringContents = JSON.stringify('abc\u1234');
        var file = new File([
            // BufferSource (ArrayBufferView (Int8Array, etc. or DataView) or ArrayBuffer), Blob, or USVString (strings without unpaired surrogates)
            stringContents
        ],
        fileName, // USVString (strings without unpaired surrogates)
        {
            type: contentType, // DOMString
            lastModified: currTime // Or number
        });
        typeson.stringifyAsync(file).then(function (tson) {
            var back = typeson.parse(tson);
            expect(back.lastModified).to.equal(currTime.getTime());
            expect(back.type).to.equal(contentType);
            expect(back.name).to.equal(fileName);
            var reader = new FileReader();
            reader.addEventListener('load', function () {
                expect(reader.result).to.equal(stringContents);
                done();
            });
            reader.addEventListener('error', function () {
                assert(false, "FileReader should not err");
            });
            reader.readAsText(back);
        });
    });
});

describe('FileList', function () {
    this.timeout(10000);
    it('should get back a FileList instance with the original data', function () {
        var currTime = new Date();
        var anotherTime = new Date('1985');

        var input = document.createElement('input');
        input.type = 'file';
        input.files = [ // See the test-entry for our adapter to make this settable
            new File([
                'content1'
            ],
            'abc',
            {
                type: 'text/plain', // DOMString
                lastModified: currTime // Or number
            }),
            new File([
                'content2'
            ],
            'def',
            {
                type: 'text/html', // DOMString
                lastModified: anotherTime // Or number
            })
        ];

        expect(input.files).to.be.an.instanceOf(FileList);
        var typeson = new Typeson().register(
            require('../types/filelist')
        );
        var tson = typeson.stringify(input.files);
        var back = typeson.parse(tson);
        expect(back.item(0)).to.be.an.instanceOf(File);
        expect(back.item(0).lastModified).to.equal(currTime.getTime());
        expect(back.item(0).type).to.equal('text/plain');
        expect(back.item(0).name).to.equal('abc');
        expect(back.item(1)).to.be.an.instanceOf(File);
        expect(back.item(1).lastModified).to.equal(anotherTime.getTime());
        expect(back.item(1).type).to.equal('text/html');
        expect(back.item(1).name).to.equal('def');
    });
    it('should get back a FileList instance with the original data asynchronously', function () {
        var currTime = new Date();
        var anotherTime = new Date('1985');

        var input = document.createElement('input');
        input.type = 'file';
        input.files = [ // See the test-entry for our adapter to make this settable
            new File([
                'content1'
            ],
            'abc',
            {
                type: 'text/plain', // DOMString
                lastModified: currTime // Or number
            }),
            new File([
                'content2'
            ],
            'def',
            {
                type: 'text/html', // DOMString
                lastModified: anotherTime // Or number
            })
        ];

        expect(input.files).to.be.an.instanceOf(FileList);
        var typeson = new Typeson().register(
            require('../types/filelist')
        );
        typeson.stringifyAsync(input.files).then(function (tson) {
            var back = typeson.parse(tson);
            expect(back.item(0)).to.be.an.instanceOf(File);
            expect(back.item(0).lastModified).to.equal(currTime.getTime());
            expect(back.item(0).type).to.equal('text/plain');
            expect(back.item(0).name).to.equal('abc');
            expect(back.item(1)).to.be.an.instanceOf(File);
            expect(back.item(1).lastModified).to.equal(anotherTime.getTime());
            expect(back.item(1).type).to.equal('text/html');
            expect(back.item(1).name).to.equal('def');
        });
    });
});

describe('Non-built-in object ignoring', function () {
    it('should ignore non-built-in objects (simulated)', function () {
        var typeson = new Typeson().register(
            require('../types/nonbuiltin-ignore')
        );
        var john = new util.Person('John Doe');
        var simulatedNonBuiltInObject = new util.SimulatedNonBuiltIn();
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
        var bob = new util.Person('Bob Smith', 30, new Date(2000, 5, 20), true);

        var simulatedNonBuiltInObject = new util.SimulatedNonBuiltIn();
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
        var bob = new util.Person('Bob Smith', 30, new Date(2000, 5, 20), true);
        bob.nonbuiltin = new util.SimulatedNonBuiltIn();
        var simulatedNonBuiltInObject = new util.SimulatedNonBuiltIn();
        var tson = typeson.stringify({a: bob, b: simulatedNonBuiltInObject});
        var back = typeson.parse(tson);
        expect(back).to.deep.equal({
            a: {name: 'Bob Smith', age: 30, isMarried: true, dob: new Date(2000, 5, 20).toJSON()}
        });
        expect('nonbuiltin' in back.a).to.be.false;
    });
});

describe('Cloneables', function () {
    it('Should work with custom cloneable objects', function () {
        var typeson = new Typeson().register(
            require('../types/cloneable')
        );
        var objArg = {a: 1, b: 2};
        var mc = new util.MyCloneable(objArg);
        var originalNonpersistentStateInfo = mc.nonpersistentStateInfo;

        var encapsulated = typeson.encapsulate(mc);
        expect(mc.__cloneEncapsulate()).to.deep.equal({obj: JSON.stringify(objArg)});
        expect('nonpersistentStateInfo' in encapsulated).to.be.false;
        expect('prototypeProperty' in encapsulated).to.be.false;

        var tson = JSON.stringify(encapsulated);
        var back = typeson.parse(tson);

        expect(back).to.be.an.instanceOf(util.MyCloneable);
        expect(back).to.not.equal(mc);
        expect(back.obj).to.deep.equal(objArg);
        expect(back.hasOwnProperty('nonpersistentStateInfo')).to.be.true;
        expect(back.nonpersistentStateInfo).to.not.equal(originalNonpersistentStateInfo);
        expect('prototypeProperty' in back).to.be.true;
        expect(back.hasOwnProperty('prototypeProperty')).to.be.false;
    });
});

describe('Resurrectables', function () {
    it('Should work with custom resurrectable objects', function () {
        var typeson = new Typeson().register(
            require('../types/resurrectable')
        );
        var mr = new util.MyResurrectable();
        var mr2 = function resurrectableFunction () {};
        var mr3 = Symbol('resurrectable');
        var mr4 = {};
        var mr5 = [3, 4, 5];

        var encapsulated = typeson.encapsulate([mr, mr2, mr3, mr4, mr5]);
        var tson = JSON.stringify(encapsulated);
        var back = typeson.parse(tson);

        expect(back[0]).to.equal(mr);
        expect(back[1]).to.equal(mr2);
        expect(back[2]).to.equal(mr3);
        expect(back[3]).to.not.equal(mr4);
        expect(back[4]).to.not.equal(mr5);
    });
});

describe('Presets', function () {
    describe('Built-in (as preset)', function () {
        BuiltIn([require('../presets/builtin')]);
    });
    describe('Universal', function () {
        BuiltIn([require('../presets/universal')]);
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
            var john = new util.Person('John Doe');
            var bob = new util.Person('Bob Smith', 30, new Date(2000, 5, 20), true);

            var clonedData = typeson.parse(typeson.stringify([john, bob]));
            expect(clonedData).to.have.same.deep.members([
                {name: 'John Doe'},
                {name: 'Bob Smith', dob: new Date(2000, 5, 20), age: 30, isMarried: true}
            ]);
        });
    });
    // TODO: Could add a shimmed postMessage test though covered by worker test
    // TODO: Add test for socketio
});
