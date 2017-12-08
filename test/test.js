/* eslint-env mocha */
/* globals expect, assert, imageTestFileNode */
/* eslint-disable no-unused-expressions */
import Typeson from '../index.js';
import testEnvironment from '../test/test-environment.js'; // eslint-disable-line no-unused-vars
import util from './test-utils.js';

const {
    types: {
        errors, typedArrays, intlTypes,
        undef, primitiveObjects, nan, infinity,
        negativeInfinity, date, error,
        regexp, map, set, arraybuffer,
        dataview, imagedata, imagebitmap,
        blob, file, filelist, nonbuiltinIgnore,
        userObject, cloneable, resurrectable
    },
    presets: {
        builtin, universal, structuredCloningThrowing,
        structuredCloning, specialNumbers, postMessage,
        undef: undefPreset, sparseUndefined
    }
} = Typeson;

function ErrorAndErrors (preset) {
    describe('Error and Errors', () => {
        it('should get back real Error instances corresponding to their types and with the original name and message', () => {
            const typeson = new Typeson().register(preset || [error, errors]);
            const json = typeson.stringify({
                e1: new Error('Error1'),
                e2: new TypeError('Error2'),
                e3: new RangeError('Error3'),
                e4: new SyntaxError('Error4'),
                e5: new ReferenceError('Error5')
                // , e6: new InternalError('Error6')
            });
            const obj = typeson.parse(json);
            expect(obj.e1).to.be.an.instanceOf(Error);
            expect(obj.e1.name).to.equal('Error');
            expect(obj.e2).to.be.an.instanceOf(TypeError);
            expect(obj.e2.name).to.equal('TypeError');
            expect(obj.e3).to.be.an.instanceOf(RangeError);
            expect(obj.e3.name).to.equal('RangeError');
            expect(obj.e4).to.be.an.instanceOf(SyntaxError);
            expect(obj.e4.name).to.equal('SyntaxError');
            expect(obj.e5).to.be.an.instanceOf(ReferenceError);
            expect(obj.e5.name).to.equal('ReferenceError');
            // Non-standard
            // expect(obj.e6).to.be.an.instanceOf(InternalError);
            // expect(obj.e6.name).to.equal('InternalError');
        });
    });
}

function SpecialNumbers (preset) {
    describe('Special numbers', () => {
        it('NaN', () => {
            const typeson = new Typeson().register(preset || nan);
            const tson = typeson.stringify(NaN, null, 2);
            const back = typeson.parse(tson);
            expect(back).to.be.NaN;
        });
        it('Infinity', () => {
            const typeson = new Typeson().register(preset || infinity);
            const tson = typeson.stringify(Infinity, null, 2);
            const back = typeson.parse(tson);
            expect(back).to.equal(Infinity);
        });
        it('-Infinity', () => {
            const typeson = new Typeson().register(preset || negativeInfinity);
            const tson = typeson.stringify(-Infinity, null, 2);
            const back = typeson.parse(tson);
            expect(back).to.equal(-Infinity);
        });
        it('should not mistake string forms of the special numbers', () => {
            const typeson = new Typeson().register(preset || [
                nan, infinity, negativeInfinity
            ]);
            let tson = typeson.stringify('NaN', null, 2);
            let back = typeson.parse(tson);
            expect(back).to.equal('NaN');
            tson = typeson.stringify('Infinity', null, 2);
            back = typeson.parse(tson);
            expect(back).to.equal('Infinity');
            tson = typeson.stringify('-Infinity', null, 2);
            back = typeson.parse(tson);
            expect(back).to.equal('-Infinity');
        });
        it('should not disturb encoding of normal numbers', () => {
            const typeson = new Typeson().register(preset || [
                nan, infinity, negativeInfinity
            ]);
            const tson = typeson.stringify(512, null, 2);
            const back = typeson.parse(tson);
            expect(back).to.equal(512);
        });
    });
}

function Undefined (preset) {
    describe('undefined type', () => {
        it('should be possible to restore `undefined` properties', () => {
            const typeson = new Typeson().register(preset || undef);
            const a = [undefined, {b: undefined, c: [3, null, , undefined]}]; // eslint-disable-line no-sparse-arrays
            const json = typeson.stringify(a);
            const a2 = typeson.parse(json);
            expect(a2.length).to.equal(2);
            expect(a2[0]).to.equal(undefined);
            expect(a2[1].b).to.equal(undefined);
            expect('b' in a2[1]).to.be.true;
            expect(a2[1].c[0]).to.equal(3);
            expect(a2[1].c[1]).to.equal(null);
            expect(a2[1].c[3]).to.equal(undefined);

            expect('0' in a2).to.be.true;
            expect('b' in a2[1]).to.be.true;
            expect('1' in a2[1].c).to.be.true;
            expect('3' in a2[1].c).to.be.true;

            if (preset) {
                expect(a2[1].c[2]).to.equal(undefined);
                expect('2' in a2[1].c).to.be.false;
            } else {
                expect(a2[1].c[2]).to.not.equal(undefined);
                expect(a2[1].c[2]).to.equal(null);
                expect('2' in a2[1].c).to.be.true;
            }
        });

        it('should be possible to restore `undefined` at root', () => {
            const typeson = new Typeson().register(preset || undef);
            const tson = typeson.stringify(undefined);
            expect(tson).to.equal('{"$":null,"$types":{"$":{"":"undef"}}}');
            const back = typeson.parse(tson);
            expect(back).to.be.undefined;
        });
    });
}

function BuiltIn (preset) {
    Undefined(preset);

    describe('Primitive objects', () => {
        it('String object', () => {
            const typeson = new Typeson().register(preset || primitiveObjects);
            const strObj = new String('hello'); // eslint-disable-line no-new-wrappers
            const tson = typeson.stringify(strObj, null, 2);
            const back = typeson.parse(tson);
            expect(back).to.be.an.instanceOf(String);
            expect(back.valueOf()).to.equal('hello');
            expect(back.length).to.equal(5);
        });
        it('Boolean object', () => {
            const typeson = new Typeson().register(preset || primitiveObjects);
            const strObj = new Boolean(true); // eslint-disable-line no-new-wrappers
            const tson = typeson.stringify(strObj, null, 2);
            const back = typeson.parse(tson);
            expect(back).to.be.an.instanceOf(Boolean);
            expect(back.valueOf()).to.equal(true);
        });
        it('Number object', () => {
            const typeson = new Typeson().register(preset || primitiveObjects);
            const strObj = new Number(456); // eslint-disable-line no-new-wrappers
            const tson = typeson.stringify(strObj, null, 2);
            const back = typeson.parse(tson);
            expect(back).to.be.an.instanceOf(Number);
            expect(back.valueOf()).to.equal(456);
        });
    });

    SpecialNumbers();

    describe('Date', () => {
        it('should get back a real Date instance with the original time milliseconds', () => {
            const typeson = new Typeson().register(preset || date);
            const json = typeson.stringify(new Date(1234567));
            const obj = typeson.parse(json);
            expect(obj).to.be.an.instanceOf(Date);
            expect(obj.getTime()).to.equal(1234567);
        });
        it('should get back a real invalid Date instance', () => {
            const typeson = new Typeson().register(preset || date);
            const json = typeson.stringify(new Date(NaN));
            const obj = typeson.parse(json);
            expect(obj).to.be.an.instanceOf(Date);
            expect(obj.getTime()).to.be.NaN;
        });
    });

    ErrorAndErrors(preset);

    describe('RegExp', () => {
        it('should return a RegExp', () => {
            const typeson = new Typeson().register(preset || [regexp]);
            let regex = new RegExp('ab?c', 'guy');
            let tson = typeson.stringify(regex, null, 2);
            let back = typeson.parse(tson);
            expect(back instanceof RegExp);
            expect(back.global).to.equal(true);
            expect(back.unicode).to.equal(true);
            expect(back.sticky).to.equal(true);
            expect(back.ignoreCase).to.equal(false);
            expect(back.multiline).to.equal(false);
            expect(back.source).to.equal('ab?c');

            regex = /ab?c/im;
            tson = typeson.stringify(regex, null, 2);
            back = typeson.parse(tson);
            expect(back instanceof RegExp);
            expect(back.global).to.equal(false);
            expect(back.unicode).to.equal(false);
            expect(back.sticky).to.equal(false);
            expect(back.ignoreCase).to.equal(true);
            expect(back.multiline).to.equal(true);
            expect(back.source).to.equal('ab?c');
        });
    });

    describe('Map', () => {
        it('should get back a real Map instance with the original data and use complex types also in contained items', () => {
            const typeson = new Typeson().register(preset || map);
            const map1 = new Map();
            const error = new Error('Error here'),
                date = new Date(10000);

            map1.set(error, date);
            const json = typeson.stringify({m: map1});
            const obj = typeson.parse(json);
            expect(obj.m).to.be.an.instanceOf(Map);
            if (preset) {
                expect(Array.from(obj.m.keys())[0]).to.be.an.instanceOf(Error);
                expect(Array.from(obj.m.values())[0]).to.be.an.instanceOf(Date);
            }
        });
    });

    describe('Set', () => {
        it('should get back a real Set instance with the original data and use complex types also in contained items', () => {
            const typeson = new Typeson().register(preset || set);
            const set1 = new Set();
            const error = new Error('Error here'),
                date = new Date(10000),
                str = '',
                o = {
                    a: error
                };

            set1.add(o);
            set1.add(date);
            set1.add(str);

            const json = typeson.stringify({s: set1});
            const obj = typeson.parse(json);

            expect(obj.s).to.be.an.instanceOf(Set);

            const a = Array.from(obj.s.values());
            if (preset) {
                expect(a[0].a).to.be.an.instanceOf(Error);
                expect(a[1]).to.be.an.instanceOf(Date);
            }
            expect(a[2]).to.be.a('string');
        });
    });

    describe('ArrayBuffer', () => {
        it('should return an ArrayBuffer', () => {
            const typeson = new Typeson().register(preset || [arraybuffer]);
            const buf = new ArrayBuffer(16);
            const tson = typeson.stringify(buf, null, 2);
            const back = typeson.parse(tson);
            expect(back instanceof ArrayBuffer);
            expect(back.byteLength).to.equal(16);
        });
    });

    describe('TypedArrays', () => {
        describe('Float64Array', () => {
            it('should get back real Float64Array instance with original array content', () => {
                const typeson = new Typeson().register(preset || [
                    arraybuffer,
                    typedArrays
                ]);
                const a = new Float64Array(3);
                a[0] = 23.8;
                a[1] = -15;
                a[2] = 99;
                const json = typeson.stringify({a: a});
                const obj = typeson.parse(json);
                expect(obj.a).to.be.an.instanceOf(Float64Array);
                expect(obj.a.length).to.equal(3);
                expect(obj.a[0]).to.equal(23.8);
                expect(obj.a[1]).to.equal(-15);
                expect(obj.a[2]).to.equal(99);
            });
        });

        describe('Uint16 arrays over invalid unicode range', () => {
            it('should work to use any 16-bit number no matter whether it is invalid unicode or not', () => {
                const typeson = new Typeson().register(preset || [
                    arraybuffer,
                    typedArrays
                ]);
                const a = new Uint16Array(0x0900);
                let i = a.length;
                while (i--) a[i] = i + 0xd780;
                let json = typeson.stringify({a: a});
                // console.log(json);

                // Emulate a textencoder that eliminates invalid UTF chars
                i = json.length;
                const copy = new Uint16Array(i);
                while (i--) {
                    const ch = json.charCodeAt(i);
                    copy[i] = ch >= 0xd800 && ch < 0xe000 ? 0xfffd : ch;
                }
                json = String.fromCharCode.apply(null, copy);

                const obj = typeson.parse(json);
                expect(obj.a).to.be.an.instanceOf(Uint16Array);
                expect(obj.a.length).to.equal(a.length);
                obj.a.forEach((x, i) => {
                    expect(x).to.equal(i + 0xd780);
                });
            });
        });

        describe('Int8 arrays with odd length', () => {
            it('should be possible to use an odd length of an Int8Array', () => {
                const typeson = new Typeson().register(preset || [
                    arraybuffer,
                    typedArrays
                ]);
                const a = new Int8Array(3);
                a[0] = 0;
                a[1] = 1;
                a[2] = 2;
                const json = typeson.stringify(a);
                // console.log(json);
                const a2 = typeson.parse(json);
                expect(a2.length).to.equal(3);
                expect(a2[0]).to.equal(0);
                expect(a2[1]).to.equal(1);
                expect(a2[2]).to.equal(2);
            });
        });
    });

    /*
    // TODO: Add for typed-arrays-socketio
    describe('TypedArrays Socket-IO', () => {
    });
    */

    describe('DataView', () => {
        it('should return a DataView', () => {
            const typeson = new Typeson().register(preset || [dataview]);
            const sample = [0x44, 0x33, 0x22, 0x11, 0xFF, 0xEE, 0xDD, 0xCC];
            const buffer = new Uint8Array(sample).buffer;
            const dataView = new DataView(buffer, 3, 4);
            expect(dataView.byteLength).to.equal(4);
            const tson = typeson.stringify(dataView, null, 2);
            const back = typeson.parse(tson);
            expect(back).to.be.an.instanceOf(DataView);
            expect(back.byteLength).to.equal(4);
        });
    });

    describe('Intl types', () => {
        it('should return a Intl.Collator', () => {
            const typeson = new Typeson().register(preset || [intlTypes]);
            // After `-u-`, the values don't appear to be validated in Node or Chrome
            const locales = ['en', 'hi', 'de-AT', 'de-DE-u-co-phonebk', 'en-US-u-kn-true', 'en-US-u-kf-upper'];
            const opts = {
                localeMatcher: 'lookup',
                usage: 'search',
                sensitivity: 'base',
                ignorePunctuation: true,
                numeric: true,
                caseFirst: 'upper'
            };
            const optsClone = JSON.parse(JSON.stringify(opts));

            const collator = new Intl.Collator(locales, opts);
            const expectedLocale = collator.resolvedOptions().locale;
            const tson = typeson.stringify(collator, null, 2);
            const back = typeson.parse(tson);
            expect(back instanceof Intl.Collator);
            // console.log(Intl.Collator.supportedLocalesOf(Object.keys(optsClone.locales), optsClone.localeMatcher));

            expect(back.resolvedOptions().locale).to.deep.equal(expectedLocale);

            Object.keys(optsClone).filter(
                (k) => ![
                    // These would ideally be present but are not available for inspection
                    'localeMatcher', 'locales'
                ].includes(k)
            ).forEach((prop) => {
                expect(back.resolvedOptions()[prop]).to.deep.equal(optsClone[prop]);
            });
        });
        it('should return a Intl.DateTimeFormat', () => {
            const typeson = new Typeson().register(preset || [intlTypes]);
            const locales = ['hi', 'de-AT', 'de-DE-u-nu-latn', 'en-US-u-ca-persian'];
            const opts = {
                localeMatcher: 'lookup',
                timeZone: 'Asia/Shanghai',
                hour12: false,
                formatMatcher: 'basic'
            };
            const optsClone = JSON.parse(JSON.stringify(opts));

            const dtf = new Intl.DateTimeFormat(locales, opts);
            const tson = typeson.stringify(dtf, null, 2);
            const back = typeson.parse(tson);
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
        it('should return a Intl.NumberFormat', () => {
            const typeson = new Typeson().register(preset || [intlTypes]);
            const locales = ['hi', 'de-AT', 'de-DE-u-nu-bali'];
            const opts = {
                localeMatcher: 'lookup',
                style: 'currency',
                currency: 'EUR',
                currencyDisplay: 'symbol',
                useGrouping: false
            };
            const optsClone = JSON.parse(JSON.stringify(opts));

            const dtf = new Intl.NumberFormat(locales, opts);
            const tson = typeson.stringify(dtf, null, 2);
            const back = typeson.parse(tson);
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

describe('ImageData', () => {
    it('should get back an ImageData instance with the original data', () => {
        const typeson = new Typeson().register(imagedata);
        const imageData = new ImageData(1, 3);
        const tson = typeson.stringify(imageData);
        const back = typeson.parse(tson);
        expect(back.width).to.equal(1);
        expect(back.height).to.equal(3);
        expect(back.data).to.deep.equal(new Uint8ClampedArray(12));
    });
});

describe('ImageBitmap', () => {
    it('should get back an ImageBitmap instance with the original data', (done) => {
        const typeson = new Typeson().register(imagebitmap);

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = document.createElement('img');
        // The onload is needed by some browsers per http://stackoverflow.com/a/4776378/271577
        img.onload = () => {
            ctx.drawImage(img, 0, 0);
            createImageBitmap(canvas).then((imageBitmap) => {
                const tson = typeson.stringify(imageBitmap);
                return typeson.parse(tson);
            }).then((back) => {
                expect(back.width).to.equal(300 /* img.width */);
                expect(back.height).to.equal(150 /* img.height */);

                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                ctx.drawImage(back, 0, 0);
                // Not getting a URL that is displaying properly or exactly consistent between Node/browser
                try { // Node
                    expect(canvas.toDataURL()).to.equal('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACWCAYAAABkW7XSAAAABmJLR0QA/wD/AP+gvaeTAAACC0lEQVR4nO3UQQ3AIADAwDF7uMMeYpiF/UiTOwV9dcy1zwMQ8N4OAPjLsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwg4wMLwgPj2swUCwAAAABJRU5ErkJggg=='
                    );
                } catch (err) {
                    try { // Chrome
                        expect(canvas.toDataURL()).to.equal('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACWCAYAAABkW7XSAAAEYklEQVR4Xu3UAQkAAAwCwdm/9HI83BLIOdw5AgQIRAQWySkmAQIEzmB5AgIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlACBB1YxAJfjJb2jAAAAAElFTkSuQmCC');
                    } catch (err) { // Firefox
                        expect(canvas.toDataURL()).to.equal('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACWCAYAAABkW7XSAAAAxUlEQVR4nO3BMQEAAADCoPVPbQhfoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOA1v9QAATX68/0AAAAASUVORK5CYII=');
                    }
                }
                done();
            });
        };
        // Didn't work with a relative path nor with an SVG file in node-canvas
        img.src = typeof imageTestFileNode !== 'undefined' ? imageTestFileNode : '../test/Flag_of_the_United_Nations.png'; // browserify-test uses testem which assumes cwd() resolution (in `Config.prototype.resolvePath` of `node_modules/testem/lib/config.js`)
    });
    it('should get back an ImageBitmap instance with the original data asynchronously', (done) => {
        const typeson = new Typeson().register(imagebitmap);

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = document.createElement('img');
        // The onload is needed by some browsers per http://stackoverflow.com/a/4776378/271577
        img.onload = () => {
            ctx.drawImage(img, 0, 0);

            createImageBitmap(canvas).then((imageBitmap) => {
                const tson = typeson.stringify(imageBitmap);
                return typeson.parseAsync(tson);
            }).then((back) => {
                expect(back.width).to.equal(300); // img.width
                expect(back.height).to.equal(150); // img.height

                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                ctx.drawImage(back, 0, 0);
                // Not getting a URL that is displaying properly or exactly consistent between Node/browser
                try { // Node
                    expect(canvas.toDataURL()).to.equal('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACWCAYAAABkW7XSAAAABmJLR0QA/wD/AP+gvaeTAAACC0lEQVR4nO3UQQ3AIADAwDF7uMMeYpiF/UiTOwV9dcy1zwMQ8N4OAPjLsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwg4wMLwgPj2swUCwAAAABJRU5ErkJggg=='
                    );
                } catch (err) {
                    try { // Chrome
                        expect(canvas.toDataURL()).to.equal('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACWCAYAAABkW7XSAAAEYklEQVR4Xu3UAQkAAAwCwdm/9HI83BLIOdw5AgQIRAQWySkmAQIEzmB5AgIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlACBB1YxAJfjJb2jAAAAAElFTkSuQmCC');
                    } catch (err) { // Firefox
                        expect(canvas.toDataURL()).to.equal('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACWCAYAAABkW7XSAAAAxUlEQVR4nO3BMQEAAADCoPVPbQhfoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOA1v9QAATX68/0AAAAASUVORK5CYII=');
                    }
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
        const typeson = new Typeson().register(blob);
        const contentType = 'application/json';
        const stringContents = JSON.stringify('abc\u1234');

        const blob1 = new Blob([
            // BufferSource (ArrayBufferView (Int8Array, etc. or DataView) or ArrayBuffer), Blob, or USVString (strings without unpaired surrogates)
            stringContents
        ],
        {
            type: contentType // DOMString
        });
        const tson = typeson.stringify(blob1);
        const back = typeson.parse(tson);
        expect(back.type).to.equal(contentType);
        expect('name' in back).to.be.false; // No file properties
        expect('lastModified' in back).to.be.false; // No file properties
        const reader = new FileReader();
        reader.addEventListener('load', () => {
            expect(reader.result).to.equal(stringContents);
            done();
        });
        reader.addEventListener('error', () => {
            assert(false, 'FileReader should not err');
        });
        reader.readAsText(back);
    });
    it('should get back a Blob instance with the original data asynchronously', (done) => {
        const typeson = new Typeson().register(blob);
        const contentType = 'application/json';
        const stringContents = JSON.stringify('abc\u1234');

        const blob1 = new Blob([
            // BufferSource (ArrayBufferView (Int8Array, etc. or DataView) or ArrayBuffer), Blob, or USVString (strings without unpaired surrogates)
            stringContents
        ],
        {
            type: contentType // DOMString
        });
        typeson.stringifyAsync(blob1).then((tson) => {
            const back = typeson.parse(tson);
            expect(back.type).to.equal(contentType);
            expect('name' in back).to.be.false; // No file properties
            expect('lastModified' in back).to.be.false; // No file properties
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                expect(reader.result).to.equal(stringContents);
                done();
            });
            reader.addEventListener('error', () => {
                assert(false, 'FileReader should not err');
            });
            reader.readAsText(back);
        });
    });
});

describe('File', function () {
    this.timeout(10000);
    it('should get back a File instance with the original data', (done) => {
        const typeson = new Typeson().register(file);
        const currTime = new Date();
        const contentType = 'application/json';
        const fileName = 'aName';
        const stringContents = JSON.stringify('abc\u1234');
        const file1 = new File([
            // BufferSource (ArrayBufferView (Int8Array, etc. or DataView) or ArrayBuffer), Blob, or USVString (strings without unpaired surrogates)
            stringContents
        ],
        fileName, // USVString (strings without unpaired surrogates)
        {
            type: contentType, // DOMString
            lastModified: currTime // Or number
        });
        const tson = typeson.stringify(file1);
        const back = typeson.parse(tson);
        expect(back.lastModified).to.equal(currTime.getTime());
        expect(back.type).to.equal(contentType);
        expect(back.name).to.equal(fileName);
        const reader = new FileReader();
        reader.addEventListener('load', () => {
            expect(reader.result).to.equal(stringContents);
            done();
        });
        reader.addEventListener('error', () => {
            assert(false, 'FileReader should not err');
        });
        reader.readAsText(back);
    });
    it('should get back a File instance with the original data asynchronously', (done) => {
        const typeson = new Typeson().register(file);
        const currTime = new Date();
        const contentType = 'application/json';
        const fileName = 'aName';
        const stringContents = JSON.stringify('abc\u1234');
        const file1 = new File([
            // BufferSource (ArrayBufferView (Int8Array, etc. or DataView) or ArrayBuffer), Blob, or USVString (strings without unpaired surrogates)
            stringContents
        ],
        fileName, // USVString (strings without unpaired surrogates)
        {
            type: contentType, // DOMString
            lastModified: currTime // Or number
        });
        typeson.stringifyAsync(file1).then((tson) => {
            const back = typeson.parse(tson);
            expect(back.lastModified).to.equal(currTime.getTime());
            expect(back.type).to.equal(contentType);
            expect(back.name).to.equal(fileName);
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                expect(reader.result).to.equal(stringContents);
                done();
            });
            reader.addEventListener('error', () => {
                assert(false, 'FileReader should not err');
            });
            reader.readAsText(back);
        });
    });
});

describe('FileList', function () {
    this.timeout(10000);
    it('should get back a FileList instance with the original data', () => {
        const currTime = new Date();
        const anotherTime = new Date('1985');

        const input = document.createElement('input');
        input.type = 'file';
        input.files = [ // See the test-environment for our adapter to make this settable
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
        const typeson = new Typeson().register(filelist);
        const tson = typeson.stringify(input.files);
        const back = typeson.parse(tson);
        expect(back.item(0)).to.be.an.instanceOf(File);
        expect(back.item(0).lastModified).to.equal(currTime.getTime());
        expect(back.item(0).type).to.equal('text/plain');
        expect(back.item(0).name).to.equal('abc');
        expect(back.item(1)).to.be.an.instanceOf(File);
        expect(back.item(1).lastModified).to.equal(anotherTime.getTime());
        expect(back.item(1).type).to.equal('text/html');
        expect(back.item(1).name).to.equal('def');
    });
    it('should get back a FileList instance with the original data asynchronously', () => {
        const currTime = new Date();
        const anotherTime = new Date('1985');

        const input = document.createElement('input');
        input.type = 'file';
        input.files = [ // See the test-environment for our adapter to make this settable
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
        const typeson = new Typeson().register(filelist);
        typeson.stringifyAsync(input.files).then((tson) => {
            const back = typeson.parse(tson);
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

describe('Non-built-in object ignoring', () => {
    it('should ignore non-built-in objects (simulated)', () => {
        const typeson = new Typeson().register(nonbuiltinIgnore);
        const john = new util.Person('John Doe');
        const simulatedNonBuiltInObject = new util.SimulatedNonBuiltIn();
        const tson = typeson.stringify({a: john, b: simulatedNonBuiltInObject});
        const back = typeson.parse(tson);
        expect(back).to.deep.equal({
            a: {name: 'John Doe'}
        });
        const a = typeson.encapsulate(['a', simulatedNonBuiltInObject, 5, null]);
        expect('0' in a).to.be.true;
        expect('1' in a).to.be.false;
        expect('2' in a).to.be.true;
        expect('3' in a).to.be.true;
    });
});

describe('User objects', () => {
    it('should do recursive type checking on user instantiated objects', () => {
        const typeson = new Typeson()
            .register([userObject, date]);
        const bob = new util.Person('Bob Smith', 30, new Date(2000, 5, 20), true);

        const simulatedNonBuiltInObject = new util.SimulatedNonBuiltIn();
        simulatedNonBuiltInObject.prop = 500;
        const tson = typeson.stringify({a: bob, b: simulatedNonBuiltInObject});
        const back = typeson.parse(tson);
        expect(back).to.deep.equal({
            a: {name: 'Bob Smith', age: 30, dob: new Date(2000, 5, 20), isMarried: true},
            b: {aaa: 5, prop: 500}
        });
        expect('dob' in back.a).to.be.true;
    });
    it('should work with nonbuiltin-ignore', () => {
        const typeson = new Typeson().register([
            userObject,
            nonbuiltinIgnore
        ]);
        const bob = new util.Person('Bob Smith', 30, new Date(2000, 5, 20), true);
        bob.nonbuiltin = new util.SimulatedNonBuiltIn();
        const simulatedNonBuiltInObject = new util.SimulatedNonBuiltIn();
        const tson = typeson.stringify({a: bob, b: simulatedNonBuiltInObject});
        const back = typeson.parse(tson);
        expect(back).to.deep.equal({
            a: {name: 'Bob Smith', age: 30, isMarried: true, dob: new Date(2000, 5, 20).toJSON()}
        });
        expect('nonbuiltin' in back.a).to.be.false;
    });
});

describe('Cloneables', () => {
    it('Should work with custom cloneable objects', () => {
        const typeson = new Typeson().register(cloneable);
        const objArg = {a: 1, b: 2};
        const mc = new util.MyCloneable(objArg);
        const originalNonpersistentStateInfo = mc.nonpersistentStateInfo;

        const encapsulated = typeson.encapsulate(mc);
        expect(mc[Symbol.for('cloneEncapsulate')]()).to.deep.equal({obj: JSON.stringify(objArg)});
        expect('nonpersistentStateInfo' in encapsulated).to.be.false;
        expect('prototypeProperty' in encapsulated).to.be.false;

        const tson = JSON.stringify(encapsulated);
        const back = typeson.parse(tson);

        expect(back).to.be.an.instanceOf(util.MyCloneable);
        expect(back).to.not.equal(mc);
        expect(back.obj).to.deep.equal(objArg);
        expect(back.hasOwnProperty('nonpersistentStateInfo')).to.be.true;
        expect(back.nonpersistentStateInfo).to.not.equal(originalNonpersistentStateInfo);
        expect('prototypeProperty' in back).to.be.true;
        expect(back.hasOwnProperty('prototypeProperty')).to.be.false;
    });
});

describe('Resurrectables', () => {
    it('Should work with custom resurrectable objects', () => {
        const typeson = new Typeson().register(resurrectable);
        const mr = new util.MyResurrectable();
        const mr2 = function resurrectableFunction () {};
        const mr3 = Symbol('resurrectable');
        const mr4 = {};
        const mr5 = [3, 4, 5];

        const encapsulated = typeson.encapsulate([mr, mr2, mr3, mr4, mr5]);
        const tson = JSON.stringify(encapsulated);
        const back = typeson.parse(tson);

        expect(back[0]).to.equal(mr);
        expect(back[1]).to.equal(mr2);
        expect(back[2]).to.equal(mr3);
        expect(back[3]).to.not.equal(mr4);
        expect(back[4]).to.not.equal(mr5);
    });
});

describe('Presets', () => {
    describe('Built-in (as preset)', () => {
        BuiltIn([builtin]);
    });

    // TODO: Could add a shimmed postMessage test though covered by worker test
    describe('postMessage', () => {
        ErrorAndErrors([postMessage]);
    });

    describe('Universal', () => {
        BuiltIn([universal]);
    });
    describe('Structured cloning', () => {
        it('should work with Structured cloning with throwing', () => {
            const typeson = new Typeson().register([structuredCloningThrowing]);
            let caught = false;
            try {
                typeson.stringify(new Error('test'));
            } catch (err) {
                caught = true;
            }
            assert(caught, 'Caught error');
            const expected = '{"$":1234567890000,"$types":{"$":{"":"date"}}}';
            const result = typeson.stringify(new Date(1234567890000));
            expect(result).to.deep.equal(expected);
        });
        it('should work with Structured cloning without throwing', () => {
            const typeson = new Typeson().register([structuredCloning]);
            let caught = false;
            try {
                typeson.stringify(new Error('test'));
            } catch (err) {
                console.log(err);
                caught = true;
            }
            assert(!caught, 'Did not catch error');
            const expected = '{"$":1234567890000,"$types":{"$":{"":"date"}}}';
            const result = typeson.stringify(new Date(1234567890000));
            expect(result).to.deep.equal(expected);
        });
        it('should allow recursive type checking on user instantiated objects', () => {
            const typeson = new Typeson().register([structuredCloning]);
            const john = new util.Person('John Doe');
            const bob = new util.Person('Bob Smith', 30, new Date(2000, 5, 20), true);

            const clonedData = typeson.parse(typeson.stringify([john, bob]));
            expect(clonedData).to.have.same.deep.members([
                {name: 'John Doe'},
                {name: 'Bob Smith', dob: new Date(2000, 5, 20), age: 30, isMarried: true}
            ]);
        });
    });
    describe('Special Numbers (as preset)', () => {
        SpecialNumbers([specialNumbers]);
    });

    // TODO: Add test for socketio

    describe('Undefined (as preset)', () => {
        Undefined([undefPreset]);
    });

    describe('Sparse undefined', () => {
        it('should be possible to restore `undefined` properties', () => {
            const typeson = new Typeson().register([sparseUndefined]);
            const a = [undefined, {b: undefined, c: [3, null, , undefined]}]; // eslint-disable-line no-sparse-arrays
            const json = typeson.stringify(a);
            const a2 = typeson.parse(json);
            expect(a2.length).to.equal(2);
            expect(a2[0]).to.equal(null);
            expect('b' in a2[1]).to.be.false;
            expect(a2[1].c[0]).to.equal(3);
            expect(a2[1].c[1]).to.equal(null);
            expect(a2[1].c[2]).to.equal(undefined);
            expect('2' in a2[1].c).to.be.false;
            expect(a2[1].c[3]).to.equal(null);
        });
    });
});

mocha.run();
