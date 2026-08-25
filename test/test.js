/* globals InternalError -- If available */
/* globals document, ImageData, createImageBitmap, FileReader,
    AudioData, EncodedAudioChunk, EncodedVideoChunk, VideoFrame,
    DOMRect, DOMPoint, DOMMatrix,
    DOMRectReadOnly, DOMPointReadOnly, DOMMatrixReadOnly,
    DOMQuad, WebTransportError,
    XMLHttpRequest, xmlHttpRequestOverrideMimeType -- Polyfills */
/* eslint-disable no-restricted-syntax -- instanceof is
    convenient for checking here */
/* eslint-disable new-cap -- For clarity */
/* eslint-disable unicorn/prefer-blob-reading-methods -- https://github.com/jsdom/jsdom/issues/2555 */
/* eslint-disable n/no-unsupported-features/node-builtins -- Testing */

/* eslint-disable no-shadow -- Needed */
import {it, describe} from 'mocha';
import {expect, assert} from 'chai';
/* eslint-enable no-shadow -- Needed */
import socketIOClient from 'socket.io-client';
import io from './helpers/io.js';

import {imageTestFileNode} from './helpers/test-environment.js';
import * as TypesonNamespace from '../index.js';
import * as util from './helpers/test-utils.js';

import {
    string2arraybuffer, arraybuffer2string
} from '../utils/stringArrayBuffer.js';
import {
    SyncBlob, SyncFile, getSyncBytes
} from '../polyfills/SyncBlobFile.js';
import {resolveObjectURL} from '../polyfills/URL.js';

/**
 * @typedef {import('typeson').Integer} Integer
 */

const {Typeson} = TypesonNamespace;

const debug = false;
/**
 *
 * @param {...any} args
 * @returns {void}
 */
function log (...args) {
    if (debug) {
        console.log(...args);
    }
}

/**
 * @typedef {import('typeson').Preset} TypesonPreset
 */

const {
    // types
    errors, typedArrays, intlTypes, typedArraysSocketio,
    undef, primitiveObjects, nan, infinity,
    negativeInfinity, date, error,
    regexp, map, set, arraybuffer, domexception,
    domrect, dompoint, domquad, dommatrix,
    audiodata, encodedaudiochunk, encodedvideochunk, videoframe,
    quotaexceedederror, webtransporterror,
    dataview, imagedata, imagebitmap,
    blob, file, filelist, nonbuiltinIgnore,
    userObject, cloneable, resurrectable,
    bigint, bigintObject,
    cryptokey, negativeZero, symbol, promise,

    // presets
    arrayNonindexKeys,
    builtin, universal, structuredCloningThrowing,
    structuredCloningForStorage,
    structuredCloning, specialNumbers, postmessage,
    undefPreset, sparseUndefined, socketio
} = TypesonNamespace;

/**
 *
 * @param {TypesonPreset} [preset]
 * @returns {void}
 */
function ErrorAndErrors (preset) {
    describe('Error and Errors', () => {
        it('should get back real Error instances corresponding to their ' +
            'types and with the original name and message', () => {
            const typeson = new Typeson().register(preset || [error, errors]);
            const e1Cause = new Error('the cause');
            const e1 =
                /**
                 * @type {{
                 *   name: string,
                 *   cause: Error,
                 *   stack: string,
                 *   fileName?: string,
                 *   lineNumber?: import('typeson').Integer,
                 *   columnNumber?: import('typeson').Integer
                 * }}
                 */
                (new Error('Error1', {
                    cause: e1Cause
                }));

            const e2 = new TypeError('Error2');
            const e3 = new RangeError('Error3');
            const e4 = new SyntaxError('Error4');
            const e5 = new ReferenceError('Error5');
            const e6 = new AggregateError([new Error('InnerError6')], 'Error6');
            // @ts-ignore Non-standard
            const e7 = typeof InternalError !== 'undefined'
                // @ts-ignore Non-standard
                ? new InternalError('Error7')
                : undefined;

            const json = typeson.stringify({
                e1, e2, e3, e4, e5, e6, e7
            });
            const obj = typeson.parse(/** @type {string} */ (json));
            expect(obj.e1).to.be.an.instanceOf(Error);
            expect(obj.e1.name).to.equal('Error');
            expect(obj.e1.message).to.equal('Error1');
            expect(obj.e1.fileName).to.equal(e1.fileName);
            expect(obj.e1.lineNumber).to.equal(e1.lineNumber);
            expect(obj.e1.columnNumber).to.equal(e1.columnNumber);
            expect(obj.e1.stack).to.equal(e1.stack);
            expect(obj.e1.stack).to.not.be.undefined;
            expect(obj.e1.cause).to.deep.equal(e1Cause);
            expect(obj.e2).to.be.an.instanceOf(TypeError);
            expect(obj.e2.name).to.equal('TypeError');
            expect(obj.e2.message).to.equal('Error2');
            expect(obj.e3).to.be.an.instanceOf(RangeError);
            expect(obj.e3.name).to.equal('RangeError');
            expect(obj.e3.message).to.equal('Error3');
            expect(obj.e4).to.be.an.instanceOf(SyntaxError);
            expect(obj.e4.name).to.equal('SyntaxError');
            expect(obj.e4.message).to.equal('Error4');
            expect(obj.e5).to.be.an.instanceOf(ReferenceError);
            expect(obj.e5.name).to.equal('ReferenceError');
            expect(obj.e5.message).to.equal('Error5');
            expect(obj.e6).to.be.an.instanceOf(AggregateError);
            expect(obj.e6.name).to.equal('AggregateError');
            expect(obj.e6.message).to.equal('Error6');
            expect(obj.e6.errors[0].message).to.equal('InnerError6');
            // @ts-ignore Non-standard
            if (typeof InternalError !== 'undefined') {
                // @ts-ignore Non-standard
                expect(obj.e7).to.be.an.instanceOf(InternalError);
                expect(obj.e7.name).to.equal('InternalError');
                expect(obj.e7.message).to.equal('Error7');
            }
        });
    });
}

/**
 *
 * @param {TypesonPreset} [preset]
 * @returns {void}
 */
function SpecialNumbers (preset) {
    describe('Special numbers', () => {
        it('NaN', () => {
            const typeson = new Typeson().register(preset || nan);
            const tson = typeson.stringify(NaN, null, 2);
            const back = typeson.parse(/** @type {string} */ (tson));
            expect(back).to.be.NaN;
        });
        it('Infinity', () => {
            const typeson = new Typeson().register(preset || infinity);
            const tson = typeson.stringify(Infinity, null, 2);
            const back = typeson.parse(/** @type {string} */ (tson));
            expect(back).to.equal(Infinity);
        });
        it('-Infinity', () => {
            const typeson = new Typeson().register(preset || negativeInfinity);
            const tson = typeson.stringify(-Infinity, null, 2);
            const back = typeson.parse(/** @type {string} */ (tson));
            expect(back).to.equal(-Infinity);
        });
        it('should not mistake string forms of the special numbers', () => {
            const typeson = new Typeson().register(preset || [
                nan, infinity, negativeInfinity
            ]);
            let tson = typeson.stringify('NaN', null, 2);
            let back = typeson.parse(/** @type {string} */ (tson));
            expect(back).to.equal('NaN');
            tson = typeson.stringify('Infinity', null, 2);
            back = typeson.parse(/** @type {string} */ (tson));
            expect(back).to.equal('Infinity');
            tson = typeson.stringify('-Infinity', null, 2);
            back = typeson.parse(/** @type {string} */ (tson));
            expect(back).to.equal('-Infinity');
        });
        it('should not disturb encoding of normal numbers', () => {
            const typeson = new Typeson().register(preset || [
                nan, infinity, negativeInfinity
            ]);
            const tson = typeson.stringify(512, null, 2);
            const back = typeson.parse(/** @type {string} */ (tson));
            expect(back).to.equal(512);
        });
    });
}

/**
 *
 * @param {TypesonPreset} [preset]
 * @returns {void}
 */
function Undefined (preset) {
    describe('undefined type', () => {
        it('should be possible to restore `undefined` properties', () => {
            const typeson = new Typeson().register(preset || undef);
            const a = [undefined, {
                // eslint-disable-next-line no-sparse-arrays -- Deliberate
                b: undefined, c: [3, null, , undefined]
            }];
            const json = typeson.stringify(a);
            const a2 = typeson.parse(/** @type {string} */ (json));
            expect(a2).to.have.lengthOf(2);
            expect(a2[0]).to.be.undefined;
            expect(a2[1].b).to.be.undefined;
            expect('b' in a2[1]).to.be.true;
            expect(a2[1].c[0]).to.equal(3);
            expect(a2[1].c[1]).to.be.null;
            expect(a2[1].c[3]).to.be.undefined;

            expect('0' in a2).to.be.true;
            expect('b' in a2[1]).to.be.true;
            expect('1' in a2[1].c).to.be.true;
            expect('3' in a2[1].c).to.be.true;

            if (preset) {
                expect(a2[1].c[2]).to.be.undefined;
                expect('2' in a2[1].c).to.be.false;
            } else {
                expect(a2[1].c[2]).to.not.be.undefined;
                expect(a2[1].c[2]).to.be.null;
                expect('2' in a2[1].c).to.be.true;
            }
        });

        it('should be possible to restore `undefined` at root', () => {
            const typeson = new Typeson().register(preset || undef);
            const tson = typeson.stringify(undefined);
            expect(tson).to.equal('{"$":0,"$types":{"$":{"":"undef"}}}');
            const back = typeson.parse(/** @type {string} */ (tson));
            expect(back).to.be.undefined;
        });
    });
}

/**
 * @param {TypesonPreset} [preset]
 * @returns {void}
 */
function testAudioData (preset) {
    describe('AudioData', function () {
        it('should return an AudioData', function () {
            const typeson = new Typeson().register(preset || [
                audiodata, arraybuffer
            ]);

            // 5 Frames, 16-bit integers
            const int16array = new Int16Array([
                100, 101, 102, 103, 104,
                100, 101, 102, 103, 104
            ]);

            const audioData = new AudioData({
                format: 's16',
                sampleRate: 48000,
                numberOfChannels: 2,
                numberOfFrames: 5,
                timestamp: 1_000_000,
                data: int16array
            });

            const tson = typeson.stringify(audioData, null, 2);
            const back = typeson.parse(/** @type {string} */ (tson));
            expect(back).to.be.an.instanceOf(AudioData);
            expect(back.format).to.equal('s16');
            expect(back.sampleRate).to.equal(48000);
            expect(back.numberOfChannels).to.equal(2);
            expect(back.numberOfFrames).to.equal(5);
            expect(back.timestamp).to.equal(1_000_000);
            // eslint-disable-next-line sonarjs/no-floating-point-equality -- Ok
            expect(back.duration).to.equal(5 / 48000);
        });

        it('should return an AudioData (planar)', function () {
            const typeson = new Typeson().register(preset || [
                audiodata, arraybuffer
            ]);

            // 5 Frames, 16-bit integers
            const int16array = new Int16Array([
                100, 101, 102, 103, 104,
                100, 101, 102, 103, 104
            ]);

            const audioData = new AudioData({
                format: 's16-planar',
                sampleRate: 48000,
                numberOfChannels: 2,
                numberOfFrames: 5,
                timestamp: 1_000_000,
                data: int16array
            });

            const tson = typeson.stringify(audioData, null, 2);
            const back = typeson.parse(/** @type {string} */ (tson));
            expect(back).to.be.an.instanceOf(AudioData);
            expect(back.format).to.equal('s16-planar');
            expect(back.sampleRate).to.equal(48000);
            expect(back.numberOfChannels).to.equal(2);
            expect(back.numberOfFrames).to.equal(5);
            expect(back.timestamp).to.equal(1_000_000);
            // eslint-disable-next-line sonarjs/no-floating-point-equality -- Ok
            expect(back.duration).to.equal(5 / 48000);
        });
    });
}
testAudioData();

/**
 * @param {TypesonPreset} [preset]
 * @returns {void}
 */
function testEncodedAudioChunk (preset) {
    describe('EncodedAudioChunk', function () {
        it('should return an EncodedAudioChunk', function () {
            const typeson = new Typeson().register(preset || [
                encodedaudiochunk, arraybuffer
            ]);

            const chunk = new EncodedAudioChunk({
                type: 'key',
                timestamp: 1_000_000,
                duration: 20_000,
                data: new Uint8Array([1, 2, 3, 4, 5])
            });

            const tson = typeson.stringify(chunk, null, 2);
            const back = typeson.parse(/** @type {string} */ (tson));
            expect(back).to.be.an.instanceOf(EncodedAudioChunk);
            expect(back.type).to.equal('key');
            expect(back.timestamp).to.equal(1_000_000);
            expect(back.duration).to.equal(20_000);
            expect(back.byteLength).to.equal(5);

            const dest = new Uint8Array(5);
            back.copyTo(dest);
            expect(dest).to.deep.equal(new Uint8Array([1, 2, 3, 4, 5]));
        });

        it(
            'should return an EncodedAudioChunk with no `duration`',
            function () {
                const typeson = new Typeson().register(preset || [
                    encodedaudiochunk, arraybuffer
                ]);

                const chunk = new EncodedAudioChunk({
                    type: 'delta',
                    timestamp: 500,
                    data: new Uint8Array([9, 8, 7])
                });

                const tson = typeson.stringify(chunk, null, 2);
                const back = typeson.parse(/** @type {string} */ (tson));
                expect(back.type).to.equal('delta');
                expect(back.duration).to.be.null;
            }
        );
    });
}
testEncodedAudioChunk();

/**
 * @param {TypesonPreset} [preset]
 * @returns {void}
 */
function testEncodedVideoChunk (preset) {
    describe('EncodedVideoChunk', function () {
        it('should return an EncodedVideoChunk', function () {
            const typeson = new Typeson().register(preset || [
                encodedvideochunk, arraybuffer
            ]);

            const chunk = new EncodedVideoChunk({
                type: 'key',
                timestamp: 2_000_000,
                duration: 16_666,
                data: new Uint8Array([5, 4, 3, 2, 1])
            });

            const tson = typeson.stringify(chunk, null, 2);
            const back = typeson.parse(/** @type {string} */ (tson));
            expect(back).to.be.an.instanceOf(EncodedVideoChunk);
            expect(back.type).to.equal('key');
            expect(back.timestamp).to.equal(2_000_000);
            expect(back.duration).to.equal(16_666);
            expect(back.byteLength).to.equal(5);

            const dest = new Uint8Array(5);
            back.copyTo(dest);
            expect(dest).to.deep.equal(new Uint8Array([5, 4, 3, 2, 1]));
        });

        it(
            'should return an EncodedVideoChunk with no `duration`',
            function () {
                const typeson = new Typeson().register(preset || [
                    encodedvideochunk, arraybuffer
                ]);

                const chunk = new EncodedVideoChunk({
                    type: 'delta',
                    timestamp: 750,
                    data: new Uint8Array([6, 7, 8])
                });

                const tson = typeson.stringify(chunk, null, 2);
                const back = typeson.parse(/** @type {string} */ (tson));
                expect(back.type).to.equal('delta');
                expect(back.duration).to.be.null;
            }
        );
    });
}
testEncodedVideoChunk();

/**
 * @param {TypesonPreset} [preset]
 * @returns {void}
 */
function testVideoFrame (preset) {
    describe('VideoFrame', function () {
        it('should return a VideoFrame (I420)', async function () {
            const typeson = new Typeson().register(preset || [
                videoframe, arraybuffer
            ]);

            // 2x2 I420: Y (4 bytes) + U (1 byte) + V (1 byte) = 6 bytes
            const data = new Uint8Array([10, 20, 30, 40, 100, 200]);
            const frame = new VideoFrame(data, {
                format: 'I420',
                codedWidth: 2,
                codedHeight: 2,
                timestamp: 1_000_000,
                duration: 33_333
            });

            const tson = await typeson.stringifyAsync(frame, null, 2);
            const back = typeson.parse(/** @type {string} */ (tson));
            expect(back).to.be.an.instanceOf(VideoFrame);
            expect(back.format).to.equal('I420');
            expect(back.codedWidth).to.equal(2);
            expect(back.codedHeight).to.equal(2);
            expect(back.timestamp).to.equal(1_000_000);
            expect(back.duration).to.equal(33_333);
            expect(back.displayWidth).to.equal(2);
            expect(back.displayHeight).to.equal(2);

            const dest = new Uint8Array(back.allocationSize());
            await back.copyTo(dest);
            expect(dest).to.deep.equal(data);
        });

        it(
            'should preserve `visibleRect`, display size, and `colorSpace`',
            async function () {
                const typeson = new Typeson().register(preset || [
                    videoframe, arraybuffer
                ]);

                // 4x4 RGBA
                const data = new Uint8Array(4 * 4 * 4).fill(128);
                const frame = new VideoFrame(data, {
                    format: 'RGBA',
                    codedWidth: 4,
                    codedHeight: 4,
                    timestamp: 0,
                    visibleRect: {x: 1, y: 1, width: 2, height: 2},
                    displayWidth: 8,
                    displayHeight: 8,
                    colorSpace: {
                        primaries: 'bt709',
                        transfer: 'iec61966-2-1',
                        matrix: 'rgb',
                        fullRange: true
                    }
                });

                const tson = await typeson.stringifyAsync(frame, null, 2);
                const back = typeson.parse(/** @type {string} */ (tson));
                expect(back.visibleRect).to.deep.equal({
                    x: 1, y: 1, width: 2, height: 2
                });
                expect(back.displayWidth).to.equal(8);
                expect(back.displayHeight).to.equal(8);
                expect(back.colorSpace).to.deep.equal({
                    primaries: 'bt709',
                    transfer: 'iec61966-2-1',
                    matrix: 'rgb',
                    fullRange: true
                });
            }
        );

        it('should return a VideoFrame with default `colorSpace`', (
            async function () {
                const typeson = new Typeson().register(preset || [
                    videoframe, arraybuffer
                ]);

                const data = new Uint8Array(2 * 2 * 4); // 2x2 RGBA
                const frame = new VideoFrame(data, {
                    format: 'RGBA',
                    codedWidth: 2,
                    codedHeight: 2,
                    timestamp: 0
                });

                const tson = await typeson.stringifyAsync(frame, null, 2);
                const back = typeson.parse(/** @type {string} */ (tson));
                expect(back.colorSpace).to.deep.equal({
                    primaries: null,
                    transfer: null,
                    matrix: null,
                    fullRange: null
                });
                expect(back.duration).to.be.null;
            }
        ));
    });
}
testVideoFrame();

/**
 * @param {TypesonPreset} [preset]
 * @returns {void}
 */
function DomRect (preset) {
    describe('DOMRect', function () {
        it('should return a DOMRect', function () {
            const typeson = new Typeson().register(preset || [domrect]);
            const domRect = new DOMRect(1, 2, 3, 4);
            const tson = typeson.stringify(domRect, null, 2);
            const back = typeson.parse(/** @type {string} */ (tson));
            expect(back).to.be.an.instanceOf(DOMRect);
            expect(back.x).to.equal(1);
            expect(back.y).to.equal(2);
            expect(back.width).to.equal(3);
            expect(back.height).to.equal(4);
        });

        it('should return a DOMRectReadOnly', function () {
            const typeson = new Typeson().register(preset || [domrect]);
            const domRect = new DOMRectReadOnly(1, 2, 3, 4);
            const tson = typeson.stringify(domRect, null, 2);
            const back = typeson.parse(/** @type {string} */ (tson));
            expect(back).to.be.an.instanceOf(DOMRectReadOnly);
            expect(back.x).to.equal(1);
            expect(back.y).to.equal(2);
            expect(back.width).to.equal(3);
            expect(back.height).to.equal(4);
        });
    });
}
DomRect();

/**
 * @param {TypesonPreset} [preset]
 * @returns {void}
 */
function DomMatrix (preset) {
    describe('DOMMatrix', function () {
        it('should return a 2d DOMMatrix', function () {
            const typeson = new Typeson().register(preset || [dommatrix]);
            const domMatrix = new DOMMatrix([1, 2, 3, 4, 5, 6]);
            const tson = typeson.stringify(domMatrix, null, 2);
            const back = typeson.parse(/** @type {string} */ (tson));
            expect(back).to.be.an.instanceOf(DOMMatrix);
            expect(back.a).to.equal(1);
            expect(back.b).to.equal(2);
            expect(back.c).to.equal(3);
            expect(back.d).to.equal(4);
            expect(back.e).to.equal(5);
            expect(back.f).to.equal(6);
        });

        it('should return a 2d DOMMatrixReadOnly', function () {
            const typeson = new Typeson().register(preset || [dommatrix]);
            const domMatrix = new DOMMatrixReadOnly([1, 2, 3, 4, 5, 6]);
            const tson = typeson.stringify(domMatrix, null, 2);
            const back = typeson.parse(/** @type {string} */ (tson));
            expect(back).to.be.an.instanceOf(DOMMatrixReadOnly);
            expect(back.a).to.equal(1);
            expect(back.b).to.equal(2);
            expect(back.c).to.equal(3);
            expect(back.d).to.equal(4);
            expect(back.e).to.equal(5);
            expect(back.f).to.equal(6);
        });

        it('should return a 3d DOMMatrix', function () {
            const typeson = new Typeson().register(preset || [dommatrix]);
            const domMatrix = new DOMMatrix([
                1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16
            ]);
            const tson = typeson.stringify(domMatrix, null, 2);
            const back = typeson.parse(/** @type {string} */ (tson));
            expect(back).to.be.an.instanceOf(DOMMatrix);
            expect(back.m11).to.equal(1);
            expect(back.m12).to.equal(2);
            expect(back.m13).to.equal(3);
            expect(back.m14).to.equal(4);
            expect(back.m21).to.equal(5);
            expect(back.m22).to.equal(6);
            expect(back.m23).to.equal(7);
            expect(back.m24).to.equal(8);
            expect(back.m31).to.equal(9);
            expect(back.m32).to.equal(10);
            expect(back.m33).to.equal(11);
            expect(back.m34).to.equal(12);
            expect(back.m41).to.equal(13);
            expect(back.m42).to.equal(14);
            expect(back.m43).to.equal(15);
            expect(back.m44).to.equal(16);
        });
    });
}

DomMatrix();

/**
 * @param {TypesonPreset} [preset]
 * @returns {void}
 */
function DomPoint (preset) {
    describe('DOMPoint', function () {
        it('should return a DOMPoint', function () {
            const typeson = new Typeson().register(preset || [dompoint]);
            const domPoint = new DOMPoint(1, 2, 3, 4);
            const tson = typeson.stringify(domPoint, null, 2);
            const back = typeson.parse(/** @type {string} */ (tson));
            expect(back).to.be.an.instanceOf(DOMPoint);
            expect(back.x).to.equal(1);
            expect(back.y).to.equal(2);
            expect(back.z).to.equal(3);
            expect(back.w).to.equal(4);
        });

        it('should return a DOMPointReadOnly', function () {
            const typeson = new Typeson().register(preset || [dompoint]);
            const domPoint = new DOMPointReadOnly(1, 2, 3, 4);
            const tson = typeson.stringify(domPoint, null, 2);
            const back = typeson.parse(/** @type {string} */ (tson));
            expect(back).to.be.an.instanceOf(DOMPointReadOnly);
            expect(back.x).to.equal(1);
            expect(back.y).to.equal(2);
            expect(back.z).to.equal(3);
            expect(back.w).to.equal(4);
        });
    });
}
DomPoint();

/**
 * @param {TypesonPreset} [preset]
 * @returns {void}
 */
function DomQuad (preset) {
    describe('DOMQuad', function () {
        it('should return a DOMQuad', function () {
            const p1 = new DOMPoint(0, 0, 0, 1);
            const p2 = new DOMPoint(1, 1, 1, 2);
            const p3 = new DOMPoint(2, 2, 2, 3);
            const p4 = new DOMPoint(3, 3, 3, 4);

            const typeson = new Typeson().register(preset || [
                dompoint, domquad
            ]);
            const domQuad = new DOMQuad(p1, p2, p3, p4);
            const tson = typeson.stringify(domQuad, null, 2);
            const back = typeson.parse(/** @type {string} */ (tson));
            expect(back).to.be.an.instanceOf(DOMQuad);
            expect(back.p1).to.deep.equal(p1);
            expect(back.p2).to.deep.equal(p2);
            expect(back.p3).to.deep.equal(p3);
            expect(back.p4).to.deep.equal(p4);
        });
    });
}
DomQuad();

/**
 * @param {TypesonPreset} [preset]
 * @returns {void}
 */
function DomException (preset) {
    describe('DOMException', function () {
        it('should return a DOMException', function () {
            const typeson = new Typeson().register(preset || [domexception]);
            const exc = new DOMException('Please try again', 'IndexSizeError');
            const tson = typeson.stringify(exc, null, 2);
            const back = typeson.parse(/** @type {string} */ (tson));
            expect(back.name).to.equal('IndexSizeError');
            expect(back.message).to.equal('Please try again');
        });
    });
}
DomException();

/**
 * @param {TypesonPreset} [preset]
 * @returns {void}
 */
function QuotaExceededErrorTest (preset) {
    describe('QuotaExceededError', function () {
        it('should return a QuotaExceededError', function () {
            const typeson = new Typeson().register(
                preset || [quotaexceedederror]
            );
            const exc = new QuotaExceededError('Not enough room', {
                quota: 100,
                requested: 200
            });
            const tson = typeson.stringify(exc, null, 2);
            const back = typeson.parse(/** @type {string} */ (tson));
            expect(back).to.be.an.instanceOf(QuotaExceededError);
            expect(back.name).to.equal('QuotaExceededError');
            expect(back.message).to.equal('Not enough room');
            expect(back.quota).to.equal(100);
            expect(back.requested).to.equal(200);
        });

        it(
            'should return a QuotaExceededError with null quota/requested',
            function () {
                const typeson = new Typeson().register(
                    preset || [quotaexceedederror]
                );
                const exc = new QuotaExceededError('Not enough room');
                const tson = typeson.stringify(exc, null, 2);
                const back = typeson.parse(/** @type {string} */ (tson));
                expect(back).to.be.an.instanceOf(QuotaExceededError);
                expect(back.quota).to.be.null;
                expect(back.requested).to.be.null;
            }
        );
    });
}
QuotaExceededErrorTest();

/**
 * @param {TypesonPreset} [preset]
 * @returns {void}
 */
function WebTransportErrorTest (preset) {
    describe('WebTransportError', function () {
        it('should return a WebTransportError', function () {
            const typeson = new Typeson().register(
                preset || [webtransporterror]
            );
            // @ts-expect-error - More recent API (single `init` argument)
            const exc = new WebTransportError({
                message: 'Stream reset',
                streamErrorCode: 42
            });
            const tson = typeson.stringify(exc, null, 2);
            const back = typeson.parse(/** @type {string} */ (tson));
            expect(back).to.be.an.instanceOf(WebTransportError);
            expect(back.name).to.equal('WebTransportError');
            expect(back.message).to.equal('Stream reset');
            expect(back.streamErrorCode).to.equal(42);
        });
    });
}
WebTransportErrorTest();

/**
 *
 * @param {TypesonPreset} [preset]
 * @returns {void}
 */
function NonindexKeys (preset) {
    describe('arrayNonindexKeys', () => {
        it('should preserve sparse arrays with non-index keys', () => {
            const typeson = new Typeson().register(preset || arrayNonindexKeys);
            /* eslint-disable no-sparse-arrays -- Deliberate */
            /**
             * @type {(number|string|undefined)[] & {ghi?: string}}
             */
            const arr = [, , 3, 4, 5];
            /* eslint-enable no-sparse-arrays -- Deliberate */
            arr.length = 10;
            arr[7] = 6;
            arr[-2] = 'abc';
            arr.ghi = 'xyz';
            const tson = typeson.stringify(arr);
            // console.log('tson', tson);
            const back = typeson.parse(/** @type {string} */ (tson));
            expect(back).to.be.an('array');
            expect(back).to.deep.equal(arr);
        });
        it('should preserve sparse arrays without non-index keys', () => {
            const typeson = new Typeson().register(preset || arrayNonindexKeys);
            /* eslint-disable no-sparse-arrays -- Deliberate testing */
            /**
             * @type {(number|string|undefined)[]}
             */
            const arr = [, , 3, 4, 5];
            /* eslint-enable no-sparse-arrays -- Deliberate testing */
            arr.length = 10;
            arr[7] = 6;
            const tson = typeson.stringify(arr);
            // console.log('tson', tson);
            const back = typeson.parse(/** @type {string} */ (tson));
            expect(back).to.be.an('array');
            expect(back).to.deep.equal(arr);
        });
        it('should preserve non-sparse arrays with non-index keys', () => {
            const typeson = new Typeson().register(preset || arrayNonindexKeys);
            /**
             * @type {(number|string|undefined)[] & {ghi?: string}}
             */
            const arr = [3, 4, 5, 6];
            arr[-2] = 'abc';
            arr.ghi = 'xyz';
            const tson = typeson.stringify(arr);
            // console.log('tson', tson);
            const back = typeson.parse(/** @type {string} */ (tson));
            expect(back).to.be.an('array');
            expect(back).to.deep.equal(arr);
        });
        it('should preserve non-sparse arrays without non-index keys', () => {
            const typeson = new Typeson().register(preset || arrayNonindexKeys);
            const arr = [3, 4, 5, 6];
            const tson = typeson.stringify(arr);
            // console.log('tson', tson);
            const back = typeson.parse(/** @type {string} */ (tson));
            expect(back).to.be.an('array');
            expect(back).to.deep.equal(arr);
        });
    });
}

/**
 *
 * @param {TypesonPreset} [preset]
 * @returns {void}
 */
function BuiltIn (preset) {
    Undefined(preset);
    NonindexKeys(preset);

    describe('Negative zero', function () {
        it('serializes +0', () => {
            const typeson = new Typeson().register(preset || negativeZero);
            const zer = 0;
            const tson = typeson.stringify(zer, null, 2);
            const back = typeson.parse(/** @type {string} */ (tson));
            expect(typeof back).to.equal('number');
            expect(back.valueOf()).to.equal(0);
            expect(Object.is(back, 0)).to.equal(true);
        });

        it('serializes -0', () => {
            const typeson = new Typeson().register(preset || negativeZero);
            const zer = -0;
            const tson = typeson.stringify(zer, null, 2);
            const back = typeson.parse(/** @type {string} */ (tson));
            expect(typeof back).to.equal('number');
            expect(back.valueOf()).to.equal(0);
            expect(Object.is(back, -0)).to.equal(true);
        });
    });

    describe('Primitive objects', () => {
        /* eslint-disable unicorn/new-for-builtins -- Deliberate testing */
        it('String object', () => {
            const typeson = new Typeson().register(preset || primitiveObjects);
            // eslint-disable-next-line no-new-wrappers -- Deliberate testing
            const strObj = new String('hello');
            const tson = typeson.stringify(strObj, null, 2);
            const back = typeson.parse(/** @type {string} */ (tson));
            expect(back).to.be.an.instanceOf(String);
            expect(back.valueOf()).to.equal('hello');
            expect(back).to.have.lengthOf(5);
        });
        it('Boolean object', () => {
            const typeson = new Typeson().register(preset || primitiveObjects);
            // eslint-disable-next-line no-new-wrappers -- Deliberate testing
            const strObj = new Boolean(true);
            const tson = typeson.stringify(strObj, null, 2);
            const back = typeson.parse(/** @type {string} */ (tson));
            expect(back).to.be.an.instanceOf(Boolean);
            expect(back.valueOf()).to.equal(true);
        });
        it('Boolean object (falsy)', () => {
            const typeson = new Typeson().register(preset || primitiveObjects);
            // eslint-disable-next-line no-new-wrappers -- Deliberate testing
            const strObj = new Boolean(false);
            const tson = typeson.stringify(strObj, null, 2);
            const back = typeson.parse(/** @type {string} */ (tson));
            expect(back).to.be.an.instanceOf(Boolean);
            expect(back.valueOf()).to.equal(false);
        });
        it('Number object', () => {
            const typeson = new Typeson().register(preset || primitiveObjects);
            // eslint-disable-next-line no-new-wrappers -- Deliberate testing
            const strObj = new Number(456);
            const tson = typeson.stringify(strObj, null, 2);
            const back = typeson.parse(/** @type {string} */ (tson));
            expect(back).to.be.an.instanceOf(Number);
            expect(back.valueOf()).to.equal(456);
        });
        // A boxed `NaN`/`Infinity`/`-Infinity`/`-0` returned bare from
        //   `replace()` would otherwise silently lose its value (become
        //   `null`) or its sign (`-0` becoming `0`) once round-tripped
        //   through JSON, since `_encapsulate`'s nested-replace guard
        //   skips giving it the sentinel treatment the bare `nan`/
        //   `infinity`/`negativeZero` type specs normally would -- see
        //   `types/primitive-objects.js`.
        it('Number object (NaN)', () => {
            const typeson = new Typeson().register(preset || primitiveObjects);
            // eslint-disable-next-line no-new-wrappers -- Deliberate testing
            const numObj = new Number(NaN);
            const tson = typeson.stringify(numObj, null, 2);
            const back = typeson.parse(/** @type {string} */ (tson));
            expect(back).to.be.an.instanceOf(Number);
            expect(Number.isNaN(back.valueOf())).to.equal(true);
        });
        it('Number object (Infinity)', () => {
            const typeson = new Typeson().register(preset || primitiveObjects);
            // eslint-disable-next-line no-new-wrappers -- Deliberate testing
            const numObj = new Number(Infinity);
            const tson = typeson.stringify(numObj, null, 2);
            const back = typeson.parse(/** @type {string} */ (tson));
            expect(back).to.be.an.instanceOf(Number);
            expect(back.valueOf()).to.equal(Infinity);
        });
        it('Number object (-Infinity)', () => {
            const typeson = new Typeson().register(preset || primitiveObjects);
            // eslint-disable-next-line no-new-wrappers -- Deliberate testing
            const numObj = new Number(-Infinity);
            const tson = typeson.stringify(numObj, null, 2);
            const back = typeson.parse(/** @type {string} */ (tson));
            expect(back).to.be.an.instanceOf(Number);
            expect(back.valueOf()).to.equal(-Infinity);
        });
        it('Number object (-0)', () => {
            const typeson = new Typeson().register(preset || primitiveObjects);
            // eslint-disable-next-line no-new-wrappers -- Deliberate testing
            const numObj = new Number(-0);
            const tson = typeson.stringify(numObj, null, 2);
            const back = typeson.parse(/** @type {string} */ (tson));
            expect(back).to.be.an.instanceOf(Number);
            expect(Object.is(back.valueOf(), -0)).to.equal(true);
        });
        /* eslint-enable unicorn/new-for-builtins -- Deliberate testing */
    });

    SpecialNumbers();

    describe('Date', () => {
        it('should get back a real Date instance with the original ' +
            'time milliseconds', () => {
            const typeson = new Typeson().register(preset || date);
            const json = typeson.stringify(new Date(1234567));
            const obj = typeson.parse(/** @type {string} */ (json));
            expect(obj).to.be.an.instanceOf(Date);
            expect(obj.getTime()).to.equal(1234567);
        });
        it('should get back a real invalid Date instance', () => {
            const typeson = new Typeson().register(preset || date);
            const json = typeson.stringify(new Date(NaN));
            const obj = typeson.parse(/** @type {string} */ (json));
            expect(obj).to.be.an.instanceOf(Date);
            expect(obj.getTime()).to.be.NaN;
        });
    });

    ErrorAndErrors(preset);

    describe('RegExp', () => {
        it('should return a RegExp', () => {
            const typeson = new Typeson().register(preset || [regexp]);
            // eslint-disable-next-line @stylistic/max-len -- Long
            // eslint-disable-next-line prefer-regex-literals, sonarjs/stateful-regex -- Deliberate testing
            let regex = new RegExp('ab?c', 'guyds');
            let tson = typeson.stringify(regex, null, 2);
            let back = typeson.parse(/** @type {string} */ (tson));
            assert(back instanceof RegExp);
            expect(back.global).to.equal(true);
            expect(back.unicode).to.equal(true);
            expect(back.sticky).to.equal(true);
            expect(back.ignoreCase).to.equal(false);
            expect(back.multiline).to.equal(false);
            expect(back.unicodeSets).to.equal(false);
            expect(back.hasIndices).to.equal(true);
            expect(back.dotAll).to.equal(true);
            expect(back.source).to.equal('ab?c');

            // @ts-expect-error Testing
            regex = /ab?c/imv;
            tson = typeson.stringify(regex, null, 2);
            back = typeson.parse(/** @type {string} */ (tson));
            assert(back instanceof RegExp);
            expect(back.global).to.equal(false);
            expect(back.unicode).to.equal(false);
            expect(back.sticky).to.equal(false);
            expect(back.ignoreCase).to.equal(true);
            expect(back.multiline).to.equal(true);
            expect(back.unicodeSets).to.equal(true);
            expect(back.hasIndices).to.equal(false);
            expect(back.dotAll).to.equal(false);
            expect(back.source).to.equal('ab?c');
        });
    });

    describe('Map', () => {
        it('should get back a real Map instance with the original data ' +
            'and use complex types also in contained items', () => {
            const typeson = new Typeson().register(preset || map);
            const map1 = new Map();
            const err = new Error('Error here'),
                dt = new Date(10000);

            map1.set(err, dt);
            const json = typeson.stringify({m: map1});
            const obj = typeson.parse(/** @type {string} */ (json));
            expect(obj.m).to.be.an.instanceOf(Map);
            if (preset) {
                expect(obj.m.keys().next().value).to.be.an.instanceOf(Error);
                expect(obj.m.values().next().value).to.be.an.instanceOf(Date);
            }
        });
    });

    describe('Set', () => {
        it('should get back a real Set instance with the original data ' +
            'and use complex types also in contained items', () => {
            const typeson = new Typeson().register(preset || set);
            const set1 = new Set();
            const err = new Error('Error here'),
                dt = new Date(10000),
                str = '',
                o = {
                    a: err
                };

            set1.add(o);
            set1.add(dt);
            set1.add(str);

            const json = typeson.stringify({s: set1});
            const obj = typeson.parse(/** @type {string} */ (json));

            expect(obj.s).to.be.an.instanceOf(Set);

            const a = obj.s.values().toArray();
            if (preset) {
                expect(a[0].a).to.be.an.instanceOf(Error);
                expect(a[1]).to.be.an.instanceOf(Date);
            }
            expect(a[2]).to.be.a('string');
        });

        it(
            'should revive shared references inside multiple sets; ' +
            'issue #27',
            function () {
                const typeson = new Typeson().register([preset || builtin]);

                const shared = {hi: 1};
                const original = [
                    new Set([shared]),
                    new Set([shared])
                ];

                const revived = typeson.revive(typeson.encapsulate(original));
                const first = [...revived[0]][0];
                const second = [...revived[1]][0];

                assert(first !== undefined, 'First set entry revived');
                assert(second !== undefined, 'Second set entry revived');
                assert(first === second, 'Sets should share same reference');
            }
        );
    });

    describe('ArrayBuffer', () => {
        it('should return an ArrayBuffer', () => {
            const typeson = new Typeson().register(preset || [arraybuffer]);
            const buf = new ArrayBuffer(16);
            const tson = typeson.stringify(buf, null, 2);
            const back = typeson.parse(/** @type {string} */ (tson));
            assert(back instanceof ArrayBuffer);
            expect(back.byteLength).to.equal(16);
            expect(back.resizable).to.equal(false);
        });

        it('should return an ArrayBuffer (resizable)', () => {
            const typeson = new Typeson().register(preset || [arraybuffer]);
            const buf = new ArrayBuffer(16, {maxByteLength: 16});
            const tson = typeson.stringify(buf, null, 2);
            const back = typeson.parse(/** @type {string} */ (tson));
            assert(back instanceof ArrayBuffer);
            expect(back.byteLength).to.equal(16);
            expect(back.resizable).to.equal(true);
        });

        it('should return the same ArrayBuffer instance', () => {
            const typeson = new Typeson().register(preset || [arraybuffer]);
            const buf1 = new ArrayBuffer(16);
            const buf2 = buf1;
            const obj = {
                buf1,
                buf2
            };
            const tson = typeson.stringify(obj, null, 2);
            const back = typeson.parse(/** @type {string} */ (tson));
            assert(back.buf1 instanceof ArrayBuffer);
            assert(back.buf2 instanceof ArrayBuffer);
            expect(back.buf1).to.equal(back.buf2);
        });
    });

    describe('TypedArrays', () => {
        describe('Float64Array', () => {
            it('should get back real Float64Array instance with ' +
                'original array content', () => {
                const typeson = new Typeson().register(preset || [
                    arraybuffer,
                    typedArrays
                ]);
                const a = new Float64Array(3);
                a[0] = 23.8;
                a[1] = -15;
                a[2] = 99;
                const json = typeson.stringify({a});
                const obj = typeson.parse(/** @type {string} */ (json));
                expect(obj.a).to.be.an.instanceOf(Float64Array);
                expect(obj.a).to.have.lengthOf(3);

                // eslint-disable-next-line @stylistic/max-len -- Long
                // eslint-disable-next-line sonarjs/no-floating-point-equality -- Ok?
                expect(obj.a[0]).to.equal(23.8);
                expect(obj.a[1]).to.equal(-15);
                expect(obj.a[2]).to.equal(99);
            });
        });

        if (typeof Float16Array !== 'undefined') {
            describe('Float16Array', () => {
                it('should get back real Float16Array instance with ' +
                    'original array content', () => {
                    const typeson = new Typeson().register(preset || [
                        arraybuffer,
                        typedArrays
                    ]);
                    const a = new Float16Array(3);
                    a[0] = 23.8;
                    a[1] = -15;
                    a[2] = 99;
                    const json = typeson.stringify({a});
                    const obj = typeson.parse(/** @type {string} */ (json));
                    expect(obj.a).to.be.an.instanceOf(Float16Array);
                    expect(obj.a).to.have.lengthOf(3);

                    expect(obj.a[0]).to.be.lessThan(24);
                    expect(obj.a[1]).to.equal(-15);
                    expect(obj.a[2]).to.equal(99);
                });
            });
        }

        describe('BigInt64Array', () => {
            it('should get back real BigInt64Array instance with ' +
                'original array content', () => {
                const typeson = new Typeson().register(preset || [
                    arraybuffer,
                    typedArrays
                ]);
                const a = new BigInt64Array(3);
                a[0] = 238n;
                a[1] = -15n;
                a[2] = 99n;
                const json = typeson.stringify({a});
                const obj = typeson.parse(/** @type {string} */ (json));
                expect(obj.a).to.be.an.instanceOf(BigInt64Array);
                expect(obj.a).to.have.lengthOf(3);
                expect(obj.a[0]).to.equal(238n);
                expect(obj.a[1]).to.equal(-15n);
                expect(obj.a[2]).to.equal(99n);
            });
        });

        describe('Uint16 arrays over invalid unicode range', () => {
            it('should work to use any 16-bit number no matter whether ' +
                'it is invalid unicode or not', () => {
                const typeson = new Typeson().register(preset || [
                    arraybuffer,
                    typedArrays
                ]);
                const a = new Uint16Array(0x0900);
                let i = a.length;
                while (i--) {
                    a[i] = i + 0xD780;
                }
                let json = /** @type {string} */ (typeson.stringify({a}));
                // console.log(json);

                // Emulate a textencoder that eliminates invalid UTF chars
                i = json.length;
                const copy = new Uint16Array(i);
                while (i--) {
                    // eslint-disable-next-line @stylistic/max-len -- Long
                    // eslint-disable-next-line unicorn/prefer-code-point -- Want char code
                    const ch = json.charCodeAt(i);
                    copy[i] = ch >= 0xD800 && ch < 0xE000 ? 0xFFFD : ch;
                }
                // eslint-disable-next-line @stylistic/max-len -- Long
                // eslint-disable-next-line unicorn/prefer-code-point -- Want char code
                json = String.fromCharCode.apply(null, Array.from(copy));

                const obj = typeson.parse(/** @type {string} */ (json));
                expect(obj.a).to.be.an.instanceOf(Uint16Array);
                expect(obj.a).to.have.lengthOf(a.length);
                /** @type {Uint16Array} */ (obj.a).forEach((x, j) => {
                    expect(x).to.equal(j + 0xD780);
                });
            });
        });

        describe('Int8 arrays with odd length', () => {
            it('should be possible to use an odd length of ' +
                'an Int8Array', () => {
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
                const a2 = typeson.parse(/** @type {string} */ (json));
                expect(a2).to.have.lengthOf(3);
                expect(a2[0]).to.equal(0);
                expect(a2[1]).to.equal(1);
                expect(a2[2]).to.equal(2);
            });
        });

        describe('Uint8 arrays with shared buffer object', () => {
            it('should return the same buffer object from different ' +
                'wrappers (or data views or buffer itself)', () => {
                const typeson = new Typeson().register(preset || [
                    arraybuffer,
                    typedArrays,
                    dataview
                ]);
                const shared = new ArrayBuffer(7);
                const dataView = new DataView(shared, 3, 4);
                const obj = {
                    wrapper1: new Uint8Array(shared),
                    wrapper2: new Uint16Array(shared, 2, 2),
                    buffer: shared,
                    dataView
                };
                obj.wrapper1[0] = 1;
                obj.wrapper2[1] = 0xFFFF;

                const json = typeson.stringify(obj);
                // console.log(json);
                const obj2 = typeson.parse(/** @type {string} */ (json));
                expect(obj2.wrapper1.buffer).to.equal(obj2.wrapper2.buffer);
                expect(obj2.wrapper1.buffer).to.equal(obj2.buffer);
                expect(obj2.wrapper1.buffer).to.equal(obj2.dataView.buffer);
            });

            it('should return the same buffer object from different ' +
                'wrappers (or data views or buffer itself) ' +
                '(maxByteLength)', () => {
                const typeson = new Typeson().register(preset || [
                    arraybuffer,
                    typedArrays,
                    dataview
                ]);

                const shared = new ArrayBuffer(7, {maxByteLength: 16});
                const dataView = new DataView(shared, 3, 4);
                const obj = {
                    wrapper1: new Uint8Array(shared),
                    wrapper2: new Uint16Array(shared, 2, 2),
                    buffer: shared,
                    dataView
                };
                obj.wrapper1[0] = 1;
                obj.wrapper2[1] = 0xFFFF;

                const json = typeson.stringify(obj);
                // console.log(json);
                const obj2 = typeson.parse(/** @type {string} */ (json));
                expect(obj2.wrapper1.buffer).to.equal(obj2.wrapper2.buffer);
                expect(obj2.wrapper1.buffer).to.equal(obj2.buffer);
                expect(obj2.wrapper1.buffer).to.equal(obj2.dataView.buffer);

                expect(obj2.buffer.maxByteLength).to.equal(16);
                expect(obj2.buffer.resizable).to.equal(true);
                expect(obj2.wrapper1.buffer.maxByteLength).to.equal(16);
                expect(obj2.wrapper2.buffer.maxByteLength).to.equal(16);
                expect(obj2.dataView.buffer.maxByteLength).to.equal(16);
            });
        });
    });

    describe('DataView', () => {
        it('should return a DataView', () => {
            const typeson = new Typeson().register(preset || [dataview]);
            const sample = [0x44, 0x33, 0x22, 0x11, 0xFF, 0xEE, 0xDD, 0xCC];
            const {buffer} = new Uint8Array(sample);
            const dataView = new DataView(buffer, 3, 4);
            expect(dataView.byteLength).to.equal(4);
            const tson = typeson.stringify(dataView, null, 2);
            const back = typeson.parse(/** @type {string} */ (tson));
            expect(back).to.be.an.instanceOf(DataView);
            expect(back.byteLength).to.equal(4);
        });
        it('should return a DataView (resizable buffer)', () => {
            const typeson = new Typeson().register(preset || [dataview]);
            const buffer = new ArrayBuffer(16, {maxByteLength: 16});
            const dataView = new DataView(buffer, 3, 4);
            expect(dataView.byteLength).to.equal(4);
            const tson = typeson.stringify(dataView, null, 2);
            const back = typeson.parse(/** @type {string} */ (tson));
            expect(back).to.be.an.instanceOf(DataView);
            expect(back.byteLength).to.equal(4);
            expect(back.buffer.resizable).to.equal(true);
        });
        it('should reproduce DataView with the same buffer', () => {
            const typeson = new Typeson().register(preset || [dataview]);
            const sample = [0x44, 0x33, 0x22, 0x11, 0xFF, 0xEE, 0xDD, 0xCC];
            const {buffer} = new Uint8Array(sample);
            const dataView1 = new DataView(buffer, 3, 4);
            const dataView2 = new DataView(buffer, 3, 4);
            const dataView3 = new DataView(buffer, 3, 4);

            const obj = {
                dataView1,
                dataView2,
                dataView3
            };

            const tson = typeson.stringify(obj, null, 2);
            const back = typeson.parse(/** @type {string} */ (tson));
            expect(back.dataView1).to.be.an.instanceOf(DataView);
            expect(back.dataView2).to.be.an.instanceOf(DataView);
            expect(back.dataView3).to.be.an.instanceOf(DataView);
            expect(back.dataView1.byteLength).to.equal(4);
        });
    });

    describe('Intl types', () => {
        it('should return a Intl.Collator', () => {
            const typeson = new Typeson().register(preset || [intlTypes]);
            // After `-u-`, the values don't appear to be validated in
            //   Node or Chrome
            const locales = [
                'en', 'hi', 'de-AT', 'de-DE-u-co-phonebk',
                'en-US-u-kn-true', 'en-US-u-kf-upper'
            ];
            const opts = /** @type {Intl.CollatorOptions} */ ({
                localeMatcher: 'lookup',
                usage: 'search',
                sensitivity: 'base',
                ignorePunctuation: true,
                numeric: true,
                caseFirst: 'upper'
            });
            const optsClone = structuredClone(opts);

            const collator = new Intl.Collator(locales, opts);
            const expectedLocale = collator.resolvedOptions().locale;
            const tson = typeson.stringify(collator, null, 2);
            const back = typeson.parse(/** @type {string} */ (tson));
            assert(back instanceof Intl.Collator);
            // console.log(Intl.Collator.supportedLocalesOf(
            //    Object.keys(optsClone.locales), optsClone.localeMatcher
            // ));

            expect(back.resolvedOptions().locale).to.deep.equal(expectedLocale);

            expect(back.resolvedOptions().usage).to.deep.equal(
                optsClone.usage
            );
            expect(back.resolvedOptions().sensitivity).to.deep.equal(
                optsClone.sensitivity
            );
            expect(back.resolvedOptions().ignorePunctuation).to.deep.equal(
                optsClone.ignorePunctuation
            );
            expect(back.resolvedOptions().numeric).to.deep.equal(
                optsClone.numeric
            );
            expect(back.resolvedOptions().caseFirst).to.deep.equal(
                optsClone.caseFirst
            );
        });
        it('should return a Intl.DateTimeFormat', () => {
            const typeson = new Typeson().register(preset || [intlTypes]);
            const locales = [
                'hi', 'de-AT', 'de-DE-u-nu-latn', 'en-US-u-ca-persian'
            ];

            /**
             * @type {{
             *   localeMatcher: 'lookup',
             *   timeZone: string,
             *   hour12: boolean,
             *   formatMatcher: 'basic'
             * }}
             */
            const opts = {
                localeMatcher: 'lookup',
                timeZone: 'Asia/Shanghai',
                hour12: false,
                formatMatcher: 'basic'
            };
            const optsClone = structuredClone(opts);

            const dtf = new Intl.DateTimeFormat(locales, opts);
            const tson = typeson.stringify(dtf, null, 2);
            const back = typeson.parse(/** @type {string} */ (tson));
            assert(back instanceof Intl.DateTimeFormat);
            expect(back.resolvedOptions().timeZone).to.deep.equal(
                optsClone.timeZone
            );
        });
        it('should return a Intl.NumberFormat', () => {
            const typeson = new Typeson().register(preset || [intlTypes]);
            const locales = ['hi', 'de-AT', 'de-DE-u-nu-bali'];
            const opts = /** @type {const} */ ({
                localeMatcher: 'lookup',
                style: 'currency',
                currency: 'EUR',
                currencyDisplay: 'symbol',
                useGrouping: false
            });
            const optsClone = structuredClone(opts);

            const dtf = new Intl.NumberFormat(locales, opts);
            const tson = typeson.stringify(dtf, null, 2);
            const back = typeson.parse(/** @type {string} */ (tson));
            assert(back instanceof Intl.NumberFormat);

            expect(back.resolvedOptions().style).to.deep.equal(
                optsClone.style
            );
            expect(back.resolvedOptions().currency).to.deep.equal(
                optsClone.currency
            );
            expect(back.resolvedOptions().currencyDisplay).to.deep.equal(
                optsClone.currencyDisplay
            );
            expect(back.resolvedOptions().useGrouping).to.deep.equal(
                optsClone.useGrouping
            );
        });
    });

    if (typeof BigInt !== 'undefined') {
        describe('BigInt', () => {
            /* eslint-disable unicorn/prefer-bigint-literals -- Testing */
            it('bigint', () => {
                const typeson = new Typeson().register(preset || bigint);
                const tson = typeson.stringify(
                    BigInt('9007199254740993'), null, 2
                );
                const back = typeson.parse(/** @type {string} */ (tson));
                expect(typeof back).to.equal('bigint');
                expect(back).to.equal(BigInt('9007199254740993'));
            });
            it('bigintObject', () => {
                const typeson = new Typeson().register(preset || bigintObject);
                const tson = typeson.stringify(
                    new Object(BigInt('9007199254740993')), null, 2
                );
                const back = typeson.parse(/** @type {string} */ (tson));
                expect(typeof back).to.equal('object');
                expect(back).to.deep.equal(
                    new Object(BigInt('9007199254740993'))
                );
            });
            /* eslint-enable unicorn/prefer-bigint-literals -- Testing */
        });
    }
}
describe('Built-in', BuiltIn);

/**
 * @param {TypesonPreset} [preset]
 * @returns {void}
 */
function cryptoKey (preset) {
    describe('CryptoKey', () => {
        it('CryptoKey', async () => {
            const typeson = new Typeson().register(preset || cryptokey);
            const key = await crypto.subtle.generateKey(
                {
                    name: 'HMAC',
                    hash: {name: 'SHA-512'}
                },
                true, // Extractable
                ['sign', 'verify']
            );
            const jwk = await crypto.subtle.exportKey('jwk', key);
            const tson = await typeson.stringifyAsync(
                key, null, 2
            );
            const back = /** @type {CryptoKey} */ (
                await typeson.parseAsync(tson)
            );
            // console.log('back', back);
            const jwkResult = await crypto.subtle.exportKey('jwk', back);
            expect(TypesonNamespace.toStringTag(back)).to.equal('CryptoKey');
            expect(JSON.stringify(jwk)).to.equal(JSON.stringify(jwkResult));
        });
    });
}

cryptoKey();

describe('symbol', function () {
    it('serializes a private symbol', function () {
        const typeson = new Typeson().register(symbol);
        const zer = Symbol('abc');
        const tson = typeson.stringify(zer, null, 2);
        const back = typeson.parse(/** @type {string} */ (tson));
        expect(typeof back).to.equal('symbol');
        expect(String(back)).to.equal('Symbol(abc)');
        expect(Symbol.keyFor(back)).to.be.undefined;
    });

    it('serializes a public symbol', function () {
        const typeson = new Typeson().register(symbol);
        const zer = Symbol.for('abc');
        const tson = typeson.stringify(zer, null, 2);
        const back = typeson.parse(/** @type {string} */ (tson));
        expect(typeof back).to.equal('symbol');
        expect(String(back)).to.equal('Symbol(abc)');
        expect(Symbol.keyFor(back)).to.equal('abc');
    });
});

describe('promise', function () {
    it('serializes a fulfilled promise', async function () {
        const typeson = new Typeson().register(promise);
        const zer = Promise.resolve('abc');
        const tson = await typeson.stringifyAsync(zer, null, 2);
        const back = typeson.parse(tson);
        expect(back).to.be.a('Promise');
        expect(await back).to.equal('abc');
    });

    it('serializes a fulfilled promise (date)', async function () {
        const typeson = new Typeson().register([promise, date]);
        const zer = Promise.resolve(new Date());
        const tson = await typeson.stringifyAsync(zer, null, 2);
        const back = typeson.parse(tson);
        expect(back).to.be.a('Promise');
        expect(await back).to.be.a('Date');
    });

    it('serializes a rejected promise', async function () {
        const typeson = new Typeson().register([promise, error]);
        const zer = Promise.reject(new Error('abc'));
        const tson = await typeson.stringifyAsync(zer, null, 2);
        const back = typeson.parse(tson);
        try {
            await back;
            throw new Error('unreached');
        } catch (err) {
            expect(/** @type {Error} */ (err).message).to.equal('abc');
        }
    });
});

/**
 * @param {import('typeson').Preset} [preset]
 * @param {boolean} [typeWithBufferEncoding]
 * @returns {void}
 */
function socketIO (preset, typeWithBufferEncoding) {
    /**
     * @typedef {any} AnyArgument
     */
    it(
        typeWithBufferEncoding
            ? 'can pass on typed arrays with Base64/JSON encoding'
            : 'can pass on typed arrays without Base64/JSON encoding',
        function () {
            /**
             * A sample custom class.
             */
            class CustomClass {
                /**
                 * @param {AnyArgument} foo
                 * @param {AnyArgument} bar
                 */
                constructor (foo, bar) {
                    this.foo = foo;
                    this.bar = bar;
                }
            }
            const TSON = new Typeson().
                register(
                    preset ||
                    typedArraysSocketio
                ).register({
                    CustomClass: [
                        (x) => x instanceof CustomClass,
                        (c) => ({foo: c.foo, bar: c.bar}),
                        (o) => new CustomClass(o.foo, o.bar)
                    ]
                });

            const array = new Float64Array(65536);
            array.fill(42, 0, 65536);

            // eslint-disable-next-line @stylistic/max-len -- Long
            // eslint-disable-next-line unicorn/no-unsafe-buffer-conversion -- Testing
            const array2 = new Float64Array(array.buffer, 64);
            array2.fill(42, 0, 65536);

            assert(array.byteOffset === 0);
            assert(array.byteLength === 524288);
            assert(array.buffer.byteLength === 524288);

            assert(array2.byteOffset === 64);
            assert(array2.byteLength === 524224);
            assert(array2.buffer.byteLength === 524288);

            const data = {
                date: new Date(),
                error: new SyntaxError('Ooops!'),
                array,
                array2,
                custom: new CustomClass('foo', 'bar')
            };

            /**
             * @typedef {any} EncapsulatedObject
             */
            /**
             *
             * @param {EncapsulatedObject} obj
             * @param {boolean} [postSockets]
             * @returns {void}
             */
            function checkPreRevival (obj, postSockets) {
                assert(obj.custom.foo === 'foo');
                assert(obj.custom.bar === 'bar');
                if (preset && !typeWithBufferEncoding) {
                    assert(typeof obj.date === 'number', 'Date as number');
                    assert(obj.error.message === 'Ooops!', 'Error as string');
                } else {
                    // Just a type or a type only with buffer encoding
                    if (!postSockets) {
                        assert(
                            obj.date instanceof Date,
                            'Date as Date object'
                        );
                    } else {
                        assert(
                            typeof obj.date === 'string',
                            'Date as string (toJSON)'
                        );
                    }
                    assert(typeof obj.error === 'object', 'Error as object');
                    assert(!Object.keys(obj.error).length, 'Error empty');
                }
                if (typeWithBufferEncoding) {
                    assert(typeof obj.array.s === 'string');
                    assert(typeof obj.array2.s === 'string');
                } else if (!postSockets) {
                    assert(obj.array instanceof ArrayBuffer);
                    assert(obj.array2 instanceof ArrayBuffer);
                } else { // Preset or not
                    assert(obj.array instanceof Uint8Array);
                    assert(obj.array instanceof Buffer);
                    assert(obj.array2 instanceof Uint8Array);
                    assert(obj.array2 instanceof Buffer);
                }
            }

            io.on('connection', (socket) => {
                const encapsulated = TSON.encapsulate(data);

                checkPreRevival(encapsulated);

                // console.log('encapsulated', encapsulated);
                socket.emit('myEvent', encapsulated);
            });
            const port = typeWithBufferEncoding ? 3001 : preset ? 3002 : 3003;
            io.listen(port);

            const socket = socketIOClient(`http://localhost:${port}`);
            socket.on('connect', function () {
                log('client connect');
            });
            // eslint-disable-next-line promise/avoid-new -- Own testing
            return new Promise((
                /** @type {(value?: any) => void} */
                resolve /* ,
                reject */
            ) => {
                socket.on('myEvent', function (e) {
                    socket.close();
                    io.close();
                    io.removeAllListeners();

                    checkPreRevival(e, true);

                    const revived = TSON.revive(e);
                    if (typeWithBufferEncoding) {
                        assert(typeof revived.date === 'string');
                        assert(typeof revived.error === 'object');
                        assert(!Object.keys(revived.error).length);

                        assert(revived.array instanceof Float64Array);
                        assert(revived.array2 instanceof Float64Array);
                    } else if (preset) {
                        assert(revived.date instanceof Date);
                        assert(revived.error instanceof SyntaxError);

                        assert(revived.array instanceof Uint8Array);
                        assert(revived.array2 instanceof Uint8Array);
                        assert(revived.array instanceof Buffer);
                        assert(revived.array2 instanceof Buffer);
                    } else {
                        assert(typeof revived.date === 'string');
                        assert(typeof revived.error === 'object');
                        assert(!Object.keys(revived.error).length);

                        assert(revived.array instanceof Uint8Array);
                        assert(revived.array2 instanceof Uint8Array);
                        assert(revived.array instanceof Buffer);
                        assert(revived.array2 instanceof Buffer);
                    }
                    assert(revived.custom instanceof CustomClass);
                    assert(revived.array.byteOffset === 0);
                    assert(revived.array.byteLength === 524288);
                    assert(revived.array.buffer.byteLength === 524288);

                    assert(revived.array2.byteOffset === 0);
                    assert(revived.array2.byteLength === 524224);
                    assert(revived.array2.buffer.byteLength === 524224);
                    resolve();
                });
                socket.connect();
            });
        }
    );
}

if (typeof io !== 'undefined') {
    describe('TypedArrays Socket-IO (as type)', function () {
        this.timeout(10000);
        socketIO();
    });
    describe('TypedArrays Socket-IO (as preset)', function () {
        this.timeout(10000);
        socketIO([socketio]);
    });
    describe(
        'TypedArrays Socket-IO (as type with arraybuffer)',
        function () {
            this.timeout(10000);
            socketIO([arraybuffer, typedArraysSocketio], true);
        }
    );
}

describe('ImageData', () => {
    it(
        'should get back an ImageData instance with the original data',
        () => {
            const typeson = new Typeson().register(imagedata);
            const imageData = new ImageData(1, 3);
            const tson = typeson.stringify(imageData);
            const back = typeson.parse(/** @type {string} */ (tson));
            expect(back.width).to.equal(1);
            expect(back.height).to.equal(3);
            expect(back.data).to.deep.equal(new Uint8ClampedArray(12));
        }
    );
});

describe('ImageBitmap', function () {
    it('should get back an ImageBitmap instance with the ' +
        'original data', function (done) {
        this.timeout(10000);
        const typeson = new Typeson().register(imagebitmap);

        const canvas = document.createElement('canvas');
        const ctx = /** @type {CanvasRenderingContext2D} */ (
            canvas.getContext('2d')
        );
        const img = document.createElement('img');
        // The onload is needed by some browsers per https://stackoverflow.com/a/4776378/271577
        img.addEventListener('load', async () => {
            ctx.drawImage(img, 0, 0);
            const imageBitmap = await createImageBitmap(canvas);
            const tson = typeson.stringify(imageBitmap);
            const back = typeson.parse(/** @type {string} */ (tson));
            expect(back.width).to.equal(300 /* img.width */);
            expect(back.height).to.equal(150 /* img.height */);

            const cvs = document.createElement('canvas');
            const cntxt = /** @type {CanvasRenderingContext2D} */ (
                cvs.getContext('2d')
            );
            cntxt.drawImage(back, 0, 0);
            // Not getting a URL that is displaying properly or exactly
            //   consistent between Node/browser
            try { // Node
                expect(cvs.toDataURL()).to.equal(
                    // eslint-disable-next-line @stylistic/max-len -- Long
                    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACWCAYAAABkW7XSAAAABmJLR0QA/wD/AP+gvaeTAAAAxUlEQVR4nO3BMQEAAADCoPVPbQhfoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOA1v9QAATX68/0AAAAASUVORK5CYII='
                );
            } catch /* (err) */ {
                try { // Chrome
                    expect(cvs.toDataURL()).to.equal(
                        // eslint-disable-next-line @stylistic/max-len -- Long
                        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACWCAYAAABkW7XSAAAAAXNSR0IArs4c6QAABGJJREFUeF7t1AEJAAAMAsHZv/RyPNwSyDncOQIECEQEFskpJgECBM5geQICBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAgQdWMQCX4yW9owAAAABJRU5ErkJggg=='
                    );
                } catch /* (toDataURLError) */ { // Firefox
                    expect(cvs.toDataURL()).to.equal(
                        // eslint-disable-next-line @stylistic/max-len -- Long
                        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACWCAYAAABkW7XSAAAEYklEQVR4Xu3UAQkAAAwCwdm/9HI83BLIOdw5AgQIRAQWySkmAQIEzmB5AgIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlACBB1YxAJfjJb2jAAAAAElFTkSuQmCC'
                    );
                }
            }
            done();
        });
        // Didn't work with a relative path nor with an SVG file in node-canvas
        img.src = imageTestFileNode;
    });
    it('should get back an ImageBitmap instance with the original ' +
        'data asynchronously', (done) => {
        const typeson = new Typeson().register(imagebitmap);

        const canvas = document.createElement('canvas');
        const ctx = /** @type {CanvasRenderingContext2D} */ (
            canvas.getContext('2d')
        );
        const img = document.createElement('img');
        // The onload is needed by some browsers per https://stackoverflow.com/a/4776378/271577
        img.addEventListener('load', async () => {
            ctx.drawImage(img, 0, 0);

            const imageBitmap = await createImageBitmap(canvas);
            const tson = typeson.stringify(imageBitmap);
            const back = /** @type {ImageBitmap} */ (
                await typeson.parseAsync(/** @type {string} */ (
                    tson
                ))
            );
            expect(back.width).to.equal(300); // img.width
            expect(back.height).to.equal(150); // img.height

            const cvs = document.createElement('canvas');
            const cntxt = /** @type {CanvasRenderingContext2D} */ (
                cvs.getContext('2d')
            );
            cntxt.drawImage(back, 0, 0);
            // Not getting a URL that is displaying properly or exactly
            //   consistent between Node/browser
            const dataURL = cvs.toDataURL();
            try { // Node < 12
                expect(dataURL).to.equal(
                    // eslint-disable-next-line @stylistic/max-len -- Long
                    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACWCAYAAABkW7XSAAAABmJLR0QA/wD/AP+gvaeTAAACC0lEQVR4nO3UQQ3AIADAwDF7uMMeYpiF/UiTOwV9dcy1zwMQ8N4OAPjLsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwg4wMLwgPj2swUCwAAAABJRU5ErkJggg=='
                );
            } catch /* (nodeLessThan12Error) */ {
                try { // Node 12
                    expect(dataURL).to.equal(
                        // eslint-disable-next-line @stylistic/max-len -- Long
                        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACWCAYAAABkW7XSAAAABmJLR0QA/wD/AP+gvaeTAAAAxUlEQVR4nO3BMQEAAADCoPVPbQhfoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOA1v9QAATX68/0AAAAASUVORK5CYII='
                    );
                } catch /* (node12PlusError) */ {
                    /* eslint-disable @stylistic/max-len -- Long */
                    try { // Chrome
                        expect(dataURL).to.equal(
                            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACWCAYAAABkW7XSAAAAAXNSR0IArs4c6QAABGJJREFUeF7t1AEJAAAMAsHZv/RyPNwSyDncOQIECEQEFskpJgECBM5geQICBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAgQdWMQCX4yW9owAAAABJRU5ErkJggg=='
                        );
                    } catch /* (toDataURLError) */ { // Firefox
                        expect(dataURL).to.equal(
                            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACWCAYAAABkW7XSAAAEYklEQVR4Xu3UAQkAAAwCwdm/9HI83BLIOdw5AgQIRAQWySkmAQIEzmB5AgIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlACBB1YxAJfjJb2jAAAAAElFTkSuQmCC'
                        );
                    }
                    /* eslint-enable @stylistic/max-len -- Long */
                }
            }
            done();
        });
        // Didn't work with a relative path nor with an SVG file in node-canvas
        img.src = imageTestFileNode;
    });
});

describe('Blob', function () {
    it('should get back a Blob instance with the ' +
        'original data', function (done) {
        this.timeout(10000);
        const typeson = new Typeson().register(blob);
        const contentType = 'application/json';
        const stringContents = JSON.stringify('abc\u{1234}');

        const blob1 = new Blob([
            // BufferSource (ArrayBufferView (Int8Array, etc. or
            //   DataView) or ArrayBuffer), Blob, or USVString
            //   (strings without unpaired surrogates)
            stringContents
        ],
        {
            type: contentType // DOMString
        });
        const tson = typeson.stringify(blob1);
        const back = typeson.parse(/** @type {string} */ (tson));

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
    it('should get back a Blob instance with the original data ' +
        'asynchronously', async () => {
        const typeson = new Typeson().register(blob);
        const contentType = 'application/json';
        const stringContents = JSON.stringify('abc\u{1234}');

        const blob1 = new Blob([
            // BufferSource (ArrayBufferView (Int8Array, etc. or DataView)
            //  or ArrayBuffer), Blob, or USVString (strings without
            //  unpaired surrogates)
            stringContents
        ],
        {
            type: contentType // DOMString
        });
        const tson = await typeson.stringifyAsync(blob1);
        const back = typeson.parse(tson);
        expect(back.type).to.equal(contentType);
        expect('name' in back).to.be.false; // No file properties
        expect('lastModified' in back).to.be.false; // No file properties

        const reader = new FileReader();

        // We return a Promise here as Mocha doesn't accept `done`
        //   and `async` together
        // eslint-disable-next-line promise/avoid-new -- Own API
        return new Promise((resolve, reject) => {
            reader.addEventListener('load', () => {
                expect(reader.result).to.equal(stringContents);
                resolve();
            });
            reader.addEventListener('error', () => {
                assert(false, 'FileReader should not err');
                reject(new Error('FileReader should not err'));
            });
            reader.readAsText(back);
        });
    });

    it('Handle large (typed array) Blobs', function (done) {
        this.timeout(30000);
        /**
         * From {@link https://github.com/web-platform-tests/wpt/blob/master/IndexedDB/support-promises.js#L291}.
         * @param {Integer} size
         * @param {Integer} seed
         * @returns {Uint8Array<ArrayBuffer>}
         */
        function largeValue (size, seed) {
            const buffer = new Uint8Array(size);
            // 32-bit xorshift - must be non-zero seed
            let state = 1000 + seed;
            for (let i = 0; i < size; ++i) {
                /* eslint-disable no-bitwise -- Convenient */
                state ^= state << 13;
                state ^= state >> 17;
                state ^= state << 5;
                buffer[i] = state & 0xFF;
                /* eslint-enable no-bitwise -- Convenient */
            }
            return buffer;
        }

        const typeson = new Typeson().register([blob]);
        const largeVal = 131072;
        const b5 = new Blob([
            largeValue(largeVal, 1)
        ], {type: 'text/x-blink-1'});
        const t5 = typeson.stringify(b5);
        const tback = typeson.parse(/** @type {string} */ (t5));
        expect(tback.size, 'Sync large val').to.equal(largeVal);

        const reader = new FileReader();
        reader.onloadend = async () => {
            const view = new Uint8Array(/** @type {ArrayBuffer} */ (
                reader.result
            ));
            expect(view.join(',')).to.equal(largeValue(largeVal, 1).join(','));

            const b6 = new Blob([
                largeValue(largeVal, 1)
            ], {type: 'text/x-blink-1'});
            const t6 = await typeson.stringifyAsync(b6);
            const tBack = typeson.parse(t6);
            expect(tBack.size, 'Async large val').to.equal(largeVal);

            const rdr = new FileReader();
            rdr.onloadend = () => {
                const vw = new Uint8Array(/** @type {ArrayBuffer} */ (
                    rdr.result
                ));
                expect(vw.join(',')).to.equal(
                    largeValue(largeVal, 1).join(',')
                );
                done();
            };
            rdr.readAsArrayBuffer(tBack);
        };
        reader.readAsArrayBuffer(tback);
    });
});

describe('File', function () {
    this.timeout(10000);
    it('should get back a File instance with the original data', (done) => {
        const typeson = new Typeson().register(file);
        const currTime = new Date();
        const contentType = 'application/json';
        const fileName = 'aName';
        const stringContents = JSON.stringify('abc\u{1234}');
        const file1 = new File(
            [
                // BufferSource (ArrayBufferView (Int8Array,
                //   etc. or DataView) or ArrayBuffer), Blob, or
                //   USVString (strings without unpaired surrogates)
                stringContents
            ],
            fileName, // USVString (strings without unpaired surrogates)
            {
                type: contentType, // DOMString
                lastModified: Number(currTime) // Or number
            }
        );
        const tson = typeson.stringify(file1);
        const back = typeson.parse(/** @type {string} */ (tson));
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
    it('should get back a File instance with the original data ' +
        'asynchronously', async () => {
        const typeson = new Typeson().register(file);
        const currTime = new Date();
        const contentType = 'application/json';
        const fileName = 'aName';
        const stringContents = JSON.stringify('abc\u{1234}');
        const file1 = new File([
            // BufferSource (ArrayBufferView (Int8Array, etc. or DataView)
            //  or ArrayBuffer), Blob, or USVString (strings without
            //  unpaired surrogates)
            stringContents
        ],
        fileName, // USVString (strings without unpaired surrogates)
        {
            type: contentType, // DOMString
            lastModified: Number(currTime) // Or number
        });
        const tson = await typeson.stringifyAsync(file1);
        const back = typeson.parse(tson);
        expect(back.lastModified).to.equal(currTime.getTime());
        expect(back.type).to.equal(contentType);
        expect(back.name).to.equal(fileName);
        const reader = new FileReader();

        // We return a Promise here as Mocha doesn't accept `done`
        //   and `async` together
        // eslint-disable-next-line promise/avoid-new -- Own API
        return new Promise((resolve, reject) => {
            reader.addEventListener('load', () => {
                expect(reader.result).to.equal(stringContents);
                resolve();
            });
            reader.addEventListener('error', () => {
                assert(false, 'FileReader should not err');
                reject(new Error('FileReader should not err'));
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
        // See the test-environment for our adapter to make this settable

        {
            /* eslint-disable sonarjs/class-name -- Clearer here */
            /**
             * For `instanceof`.
             */
            class _FileList extends Array {}
            /* eslint-enable sonarjs/class-name -- Clearer here */

            const files = /** @type {unknown} */ (new _FileList(
                new File([
                    'content1'
                ],
                'abc',
                {
                    type: 'text/plain', // DOMString
                    lastModified: Number(currTime) // Or number
                }),
                new File([
                    'content2'
                ],
                'def',
                {
                    type: 'text/html', // DOMString
                    lastModified: Number(anotherTime) // Or number
                })
            ));

            input.files = /** @type {FileList} */ (files);
        }

        expect(input.files).to.be.a('FileList');
        const typeson = new Typeson().register(filelist);
        const tson = typeson.stringify(input.files);
        const back = typeson.parse(/** @type {string} */ (tson));
        expect(back.item(0)).to.be.an.instanceOf(File);
        expect(back.item(0).lastModified).to.equal(currTime.getTime());
        expect(back.item(0).type).to.equal('text/plain');
        expect(back.item(0).name).to.equal('abc');
        expect(back.item(1)).to.be.an.instanceOf(File);
        expect(back.item(1).lastModified).to.equal(anotherTime.getTime());
        expect(back.item(1).type).to.equal('text/html');
        expect(back.item(1).name).to.equal('def');
        expect(back[Symbol.toStringTag]).to.equal('FileList');
    });
    it('should get back a FileList instance with the ' +
        'original data asynchronously', async () => {
        const currTime = new Date();
        const anotherTime = new Date('1985');

        const input = document.createElement('input');
        input.type = 'file';
        // See the test-environment for our adapter to make this settable
        {
            /* eslint-disable sonarjs/class-name -- Clearer here */
            /**
             * For `instanceof`.
             */
            class _FileList extends Array {}
            /* eslint-enable sonarjs/class-name -- Clearer here */

            const files = /** @type {unknown} */ (new _FileList(
                new File([
                    'content1'
                ],
                'abc',
                {
                    type: 'text/plain', // DOMString
                    lastModified: Number(currTime) // Or number
                }),
                new File([
                    'content2'
                ],
                'def',
                {
                    type: 'text/html', // DOMString
                    lastModified: Number(anotherTime) // Or number
                })
            ));
            input.files = /** @type {FileList} */ (files);
        }

        expect(input.files).to.be.a('FileList');
        const typeson = new Typeson().register(filelist);
        const tson = await typeson.stringifyAsync(input.files);
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

describe('Non-built-in object ignoring', () => {
    it('should ignore non-built-in objects (simulated)', () => {
        const typeson = new Typeson().register(nonbuiltinIgnore);
        const john = new util.Person('John Doe');
        const simulatedNonBuiltInObject = new util.SimulatedNonBuiltIn();
        const tson = typeson.stringify({a: john, b: simulatedNonBuiltInObject});
        const back = typeson.parse(/** @type {string} */ (tson));
        expect(back).to.deep.equal({
            a: {name: 'John Doe'}
        });
        const a = typeson.encapsulate([
            'a', simulatedNonBuiltInObject, 5, null
        ]);
        expect('0' in a).to.be.true;
        expect('1' in a).to.be.false;
        expect('2' in a).to.be.true;
        expect('3' in a).to.be.true;
    });
});

describe('User objects', () => {
    it('should do recursive type checking on user instantiated objects', () => {
        const typeson = new Typeson().
            register([userObject, date]);
        const bob = new util.Person(
            'Bob Smith', 30, new Date(2000, 5, 20), true
        );

        /**
         * @type {import('./helpers/test-utils.js').SimulatedNonBuiltIn & {
         *   prop?: number
         * }}
         */
        const simulatedNonBuiltInObject = new util.SimulatedNonBuiltIn();
        simulatedNonBuiltInObject.prop = 500;

        const tson = typeson.stringify({a: bob, b: simulatedNonBuiltInObject});
        const back = typeson.parse(/** @type {string} */ (tson));
        expect(back).to.deep.equal({
            a: {
                name: 'Bob Smith',
                age: 30,
                dob: new Date(2000, 5, 20),
                isMarried: true
            },
            b: {aaa: 5, prop: 500}
        });
        expect('dob' in back.a).to.be.true;
    });
    it('should work with nonbuiltin-ignore', () => {
        const typeson = new Typeson().register([
            userObject,
            nonbuiltinIgnore
        ]);

        /**
         * @type {import('./helpers/test-utils.js').Person &
         *   {nonbuiltin?:
         *     import('./helpers/test-utils.js').SimulatedNonBuiltIn}
         * }
         */
        const bob = new util.Person(
            'Bob Smith', 30, new Date(2000, 5, 20), true
        );
        bob.nonbuiltin = new util.SimulatedNonBuiltIn();
        const simulatedNonBuiltInObject = new util.SimulatedNonBuiltIn();
        const tson = typeson.stringify({a: bob, b: simulatedNonBuiltInObject});
        const back = typeson.parse(/** @type {string} */ (tson));
        expect(back).to.deep.equal({
            a: {
                name: 'Bob Smith',
                age: 30,
                isMarried: true,
                dob: new Date(2000, 5, 20).toJSON()
            }
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
        // @ts-ignore How to fix?
        expect(mc[Symbol.for('cloneEncapsulate')]()).to.deep.equal({
            obj: JSON.stringify(objArg)
        });
        expect('nonpersistentStateInfo' in encapsulated).to.be.false;
        expect('prototypeProperty' in encapsulated).to.be.false;

        const tson = JSON.stringify(encapsulated);
        const back = typeson.parse(tson);

        expect(back).to.be.an.instanceOf(util.MyCloneable);
        expect(back).to.not.equal(mc);
        expect(back.obj).to.deep.equal(objArg);
        expect({}.hasOwnProperty.call(
            back, 'nonpersistentStateInfo'
        )).to.be.true;
        expect(back.nonpersistentStateInfo).to.not.equal(
            originalNonpersistentStateInfo
        );
        expect('prototypeProperty' in back).to.be.true;
        expect({}.hasOwnProperty.call(back, 'prototypeProperty')).to.be.false;
    });
});

describe('Resurrectables', () => {
    it('Should work with custom resurrectable objects', () => {
        const typeson = new Typeson().register(resurrectable);
        const mr = new util.MyResurrectable();
        // eslint-disable-next-line func-name-matching -- Clear
        const mr2 = function resurrectableFunction () {
            // Empty function
        };
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
        it('bigint and Map (Issue #15)', function () {
            const typeson = new Typeson().register([builtin]);
            const tson = typeson.stringify({
                map: new Map([[1, 1n], [0, 1n]])
            }, null, 2);
            // console.log('tson', tson);
            const back = typeson.parse(/** @type {string} */ (tson));
            // console.log('back', back);
            expect(back).to.deep.equal({
                map: new Map([[1, 1n], [0, 1n]])
            });
        });
    });

    // TODO: Could add a shimmed `postMessage` test though covered
    //   by worker test
    describe('postMessage', () => {
        ErrorAndErrors([postmessage]);
    });

    describe('Universal', () => {
        BuiltIn([universal]);
    });
    describe('Structured cloning', () => {
        NonindexKeys(structuredCloningThrowing);
        cryptoKey(structuredCloningThrowing);
        testAudioData(structuredCloningThrowing);
        testEncodedAudioChunk(structuredCloningThrowing);
        testEncodedVideoChunk(structuredCloningThrowing);
        testVideoFrame(structuredCloningThrowing);
        DomException(structuredCloningThrowing);
        QuotaExceededErrorTest(structuredCloningThrowing);
        WebTransportErrorTest(structuredCloningThrowing);
        DomRect(structuredCloningThrowing);
        DomPoint(structuredCloningThrowing);
        DomQuad(structuredCloningThrowing);
        DomMatrix(structuredCloningThrowing);
        it('should work with Structured cloning with throwing', () => {
            const typeson = new Typeson().register([structuredCloningThrowing]);
            expect(() => {
                typeson.stringify(new Error('test'));
            }).to.not.throw();
            expect(() => {
                typeson.stringify(Symbol('test'));
            }).to.throw(DOMException);

            expect(() => {
                const buffer = new ArrayBuffer(8);
                buffer.transfer();
                typeson.stringify(buffer);
            }).to.throw(DOMException);

            expect(() => {
                typeson.stringify(function () {
                    //
                });
            }).to.throw(DOMException);

            // Node's native global `MessageChannel`/`MessagePort` don't set
            //   `Symbol.toStringTag` (see
            //   https://github.com/nodejs/node/issues/65527), so these also
            //   exercise the `constructor.name`-based fallback check, not
            //   just the `stringTag` one a real browser's would hit.
            expect(() => {
                typeson.stringify(new MessageChannel());
            }).to.throw(DOMException);
            expect(() => {
                typeson.stringify(new MessageChannel().port1);
            }).to.throw(DOMException);

            // https://github.com/whatwg/html/issues/5158
            expect(() => {
                typeson.stringify(Object.prototype);
            }).to.not.throw();

            expect(() => {
                typeson.stringify(document.createElement('br'));
            }).to.throw(DOMException);

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
                log(err);
                caught = true;
            }
            assert(!caught, 'Did not catch error');
            const expected = '{"$":1234567890000,"$types":{"$":{"":"date"}}}';
            const result = typeson.stringify(new Date(1234567890000));
            expect(result).to.deep.equal(expected);
        });
        it('should allow recursive type checking on ' +
            'user instantiated objects', () => {
            const typeson = new Typeson().register([structuredCloning]);
            const john = new util.Person('John Doe');
            const bob = new util.Person(
                'Bob Smith', 30, new Date(2000, 5, 20), true
            );

            const clonedData = typeson.parse(
                /** @type {string} */ (typeson.stringify([john, bob]))
            );
            expect(clonedData).to.have.same.deep.members([
                {name: 'John Doe'},
                {
                    name: 'Bob Smith',
                    dob: new Date(2000, 5, 20),
                    age: 30,
                    isMarried: true
                }
            ]);
        });
        it('should work with recursive structures', () => {
            const typeson = new Typeson().register(structuredCloningThrowing);
            /**
             * @type {object[]}
             */
            const obj = [];
            obj.push(obj);
            const clonedData = typeson.parse(
                /** @type {string} */ (typeson.stringify(obj))
            );
            expect(clonedData[0]).to.equal(clonedData);
        });
    });
    describe('Structured cloning for storage', () => {
        it(
            'should also throw for `SharedArrayBuffer`, unlike plain ' +
                '`structuredCloningThrowing`',
            () => {
                const forStorage = new Typeson().register(
                    [structuredCloningForStorage]
                );
                expect(() => {
                    forStorage.stringify(new SharedArrayBuffer(8));
                }).to.throw(DOMException);

                const throwing = new Typeson().register(
                    [structuredCloningThrowing]
                );
                expect(() => {
                    throwing.stringify(new SharedArrayBuffer(8));
                }).to.not.throw();
            }
        );
        it(
            'should still behave like `structuredCloningThrowing` for ' +
                'everything else',
            () => {
                const typeson = new Typeson().register(
                    [structuredCloningForStorage]
                );
                expect(() => {
                    typeson.stringify(new Error('test'));
                }).to.not.throw();
                expect(() => {
                    typeson.stringify(Symbol('test'));
                }).to.throw(DOMException);
                const expected =
                    '{"$":1234567890000,"$types":{"$":{"":"date"}}}';
                const result = typeson.stringify(new Date(1234567890000));
                expect(result).to.deep.equal(expected);
            }
        );
    });
    describe('Special Numbers (as preset)', () => {
        SpecialNumbers([specialNumbers]);
    });

    describe('Undefined (as preset)', () => {
        Undefined([undefPreset]);
    });

    describe('arrayNonindexKeys', () => {
        NonindexKeys([arrayNonindexKeys]);
    });

    describe('Sparse undefined', () => {
        it('should be possible to restore `undefined` properties', () => {
            const typeson = new Typeson().register([sparseUndefined]);
            const a = [undefined, {
                // eslint-disable-next-line @stylistic/max-len -- Long
                // eslint-disable-next-line no-sparse-arrays -- Deliberate testing
                b: undefined, c: [3, null, , undefined]
            }];
            const json = typeson.stringify(a);
            const a2 = typeson.parse(/** @type {string} */ (json));
            expect(a2).to.have.lengthOf(2);
            expect(a2[0]).to.be.null;
            expect('b' in a2[1]).to.be.false;
            expect(a2[1].c[0]).to.equal(3);
            expect(a2[1].c[1]).to.be.null;
            expect(a2[1].c[2]).to.be.undefined;
            expect('2' in a2[1].c).to.be.false;
            expect(a2[1].c[3]).to.be.null;
        });
    });
});

describe('Utilities', () => {
    it('arraybuffer2string', () => {
        const buffer = string2arraybuffer('test');
        const back = arraybuffer2string(buffer);
        assert(back === 'test', 'Round trip after string2arraybuffer');
    });
});

describe('Polyfills', () => {
    describe('URL.revokeObjectURL and XMLHttpRequest polyfill', () => {
        it('should throw with a revoked Blob URL', function () {
            const blob1 = new Blob([
                'test'
            ]);

            const blobURL = URL.createObjectURL(blob1);
            URL.revokeObjectURL(blobURL);

            const req = new XMLHttpRequest();
            req.overrideMimeType('text/plain; charset=x-user-defined');
            req.open('GET', blobURL, false); // Sync
            expect(() => {
                req.send();
            }).to.throw(DOMException);
        });
        it('should not negatively impact other `overrideMimeType`', () => {
            const req = new XMLHttpRequest();
            expect(() => {
                req.overrideMimeType('text/plain');
            }).to.not.throw();
        });
        it('should not negatively impact non-Blob URLs', () => {
            const req = new XMLHttpRequest();
            req.overrideMimeType('text/plain; charset=x-user-defined');
            req.open('GET', 'data:text/plain,abc', false);
            expect(() => {
                req.send();
            }).to.not.throw();
        });
    });

    // Node only
    /**
     * @typedef {{
     *   overrideMimeType: (mimeType: string) => void,
     *   open: (method: string, url: string, sync: boolean) => void,
     *   send: () => void,
     *   status: number,
     *   responseText: string
     * }} XMLHttpRequestMock
     */

    if (typeof process !== 'undefined') {
        it('URL.createObjectURL polyfill', () => {
            const temp = XMLHttpRequest.prototype.overrideMimeType;
            XMLHttpRequest.prototype.overrideMimeType = () => {
                //
            };

            const xhr = /** @type {XMLHttpRequestMock} */ ({
                overrideMimeType: xmlHttpRequestOverrideMimeType({
                    polyfillDataURLs: true
                })
            });
            const blb = new Blob(['test']);
            xhr.overrideMimeType('text/plain; charset=x-user-defined');
            xhr.open('GET', URL.createObjectURL(blb), false); // Sync
            xhr.send();
            XMLHttpRequest.prototype.overrideMimeType = temp;
            expect(xhr.status).to.equal(200);
        });

        describe('SyncBlob/SyncFile', () => {
            /**
             * Test-only: the real `getSyncBytes` can return `undefined`
             *   (for a `Blob` this module never tracked -- see its own
             *   test below), but every call here is on an instance we
             *   just created, so it's always defined.
             * @param {Blob} b
             * @returns {Buffer}
             */
            const bytes = (b) => /** @type {Buffer} */ (getSyncBytes(b));

            it('getSyncBytes should concatenate string, ArrayBuffer, ' +
                'ArrayBufferView, and nested Blob parts', () => {
                const inner = new SyncBlob(['inner']);
                const sb = new SyncBlob([
                    'abc',
                    new TextEncoder().encode('def').buffer,
                    new TextEncoder().encode('ghi'),
                    inner
                ]);
                expect(bytes(sb).toString('utf8')).to.equal(
                    'abcdefghiinner'
                );
            });
            it('should default to no parts', () => {
                const sb = new SyncBlob();
                expect(bytes(sb)).to.have.lengthOf(0);
            });
            it('should stringify any other part type', () => {
                // @ts-expect-error -- Intentionally invalid `BlobPart`,
                //   to exercise the stringifying fallback
                const sb = new SyncBlob([5]);
                expect(bytes(sb).toString('utf8')).to.equal('5');
            });
            it('SyncFile should track its own bytes and expose File ' +
                'properties', () => {
                const sf = new SyncFile(['content'], 'my.txt', {
                    type: 'text/plain', lastModified: 123
                });
                expect(bytes(sf).toString('utf8')).to.equal('content');
                expect(sf.name).to.equal('my.txt');
                expect(sf.lastModified).to.equal(123);
            });
            it('getSyncBytes should return `undefined` for a Blob it ' +
                'never tracked', () => {
                expect(getSyncBytes(new Blob(['x']))).to.be.undefined;
            });
            it('should let the URL/XMLHttpRequest polyfills read a ' +
                'SyncBlob synchronously (no jsdom wrapper needed)', () => {
                const temp = XMLHttpRequest.prototype.overrideMimeType;
                XMLHttpRequest.prototype.overrideMimeType = () => {
                    //
                };

                const xhr = /** @type {XMLHttpRequestMock} */ ({
                    overrideMimeType: xmlHttpRequestOverrideMimeType({
                        polyfillDataURLs: true
                    })
                });
                const sb = new SyncBlob(['sync content']);
                xhr.overrideMimeType('text/plain; charset=x-user-defined');
                xhr.open('GET', URL.createObjectURL(sb), false); // Sync
                xhr.send();
                XMLHttpRequest.prototype.overrideMimeType = temp;
                expect(xhr.status).to.equal(200);
                expect(xhr.responseText).to.equal('sync content');
            });
        });

        describe('resolveObjectURL', () => {
            it('should return `undefined` for an unregistered URL', () => {
                expect(resolveObjectURL('blob:not-a-real-url')).
                    to.be.undefined;
            });
            it('should return `undefined` when the registered value has ' +
                'no readable bytes', () => {
                // Registering a non-`Blob` value simulates a `Blob` neither
                //   `SyncBlob` nor jsdom's `implForWrapper` can read.
                const fakeBlob = /** @type {Blob} */ (
                    /** @type {unknown} */ ({type: 'text/plain'})
                );
                const url = URL.createObjectURL(fakeBlob);
                expect(resolveObjectURL(url)).to.be.undefined;
            });
            it('should resolve a registered SyncBlob to its type and ' +
                'bytes', () => {
                const sb = new SyncBlob(
                    ['resolved content'], {type: 'text/plain'}
                );
                const url = URL.createObjectURL(sb);
                // Test-only: we just registered `sb` above, so this is
                //   always defined.
                const resolved = /** @type {{type: string, bytes: Buffer}} */
                    (resolveObjectURL(url));
                expect(resolved.type).to.equal('text/plain');
                expect(resolved.bytes.toString('utf8')).to.equal(
                    'resolved content'
                );
            });
        });
    }

    describe('AudioData', () => {
        it('should throw for an unsupported format', () => {
            expect(() => new AudioData({
                // @ts-expect-error - Intentionally invalid
                format: 'bogus',
                sampleRate: 48000,
                numberOfChannels: 1,
                numberOfFrames: 5,
                timestamp: 0,
                data: new Int16Array(5)
            })).to.throw(TypeError);
        });

        it('should accept a raw `ArrayBuffer` as `data`', () => {
            const audioData = new AudioData({
                format: 's16',
                sampleRate: 48000,
                numberOfChannels: 1,
                numberOfFrames: 5,
                timestamp: 0,
                data: new Int16Array(5).buffer
            });
            expect(audioData.numberOfFrames).to.equal(5);
        });

        it(
            'should throw when `planeIndex` exceeds the channel count ' +
            '(planar)',
            () => {
                const audioData = new AudioData({
                    format: 's16-planar',
                    sampleRate: 48000,
                    numberOfChannels: 2,
                    numberOfFrames: 5,
                    timestamp: 0,
                    data: new Int16Array(10)
                });
                expect(() => {
                    audioData.allocationSize({planeIndex: 2});
                }).to.throw(RangeError);
            }
        );

        it(
            'should throw when `planeIndex` is non-zero (interleaved)',
            () => {
                const audioData = new AudioData({
                    format: 's16',
                    sampleRate: 48000,
                    numberOfChannels: 2,
                    numberOfFrames: 5,
                    timestamp: 0,
                    data: new Int16Array(10)
                });
                expect(() => {
                    audioData.allocationSize({planeIndex: 1});
                }).to.throw(RangeError);
            }
        );

        it('should accept an explicit `frameCount` option', () => {
            const audioData = new AudioData({
                format: 's16',
                sampleRate: 48000,
                numberOfChannels: 1,
                numberOfFrames: 5,
                timestamp: 0,
                data: new Int16Array(5)
            });
            expect(audioData.allocationSize({
                planeIndex: 0, frameCount: 3
            })).to.equal(6);
        });

        it(
            'should throw when `frameOffset`/`frameCount` exceed ' +
            '`numberOfFrames`',
            () => {
                const audioData = new AudioData({
                    format: 's16',
                    sampleRate: 48000,
                    numberOfChannels: 1,
                    numberOfFrames: 5,
                    timestamp: 0,
                    data: new Int16Array(5)
                });
                expect(() => {
                    audioData.copyTo(new Int16Array(5), {
                        planeIndex: 0, frameOffset: 4, frameCount: 5
                    });
                }).to.throw(RangeError);
            }
        );

        it('should throw when the destination buffer is too small', () => {
            const audioData = new AudioData({
                format: 's16',
                sampleRate: 48000,
                numberOfChannels: 1,
                numberOfFrames: 5,
                timestamp: 0,
                data: new Int16Array(5)
            });
            expect(() => {
                audioData.copyTo(new Int16Array(1), {planeIndex: 0});
            }).to.throw(RangeError);
        });

        it('should copy to a raw `ArrayBuffer` destination', () => {
            const audioData = new AudioData({
                format: 's16',
                sampleRate: 48000,
                numberOfChannels: 1,
                numberOfFrames: 5,
                timestamp: 0,
                data: new Int16Array([1, 2, 3, 4, 5])
            });
            const dest = new ArrayBuffer(10);
            audioData.copyTo(dest, {planeIndex: 0});
            expect(new Int16Array(dest)).to.deep.equal(
                new Int16Array([1, 2, 3, 4, 5])
            );
        });
    });

    describe('EncodedAudioChunk', () => {
        it('should throw for an unsupported type', () => {
            expect(() => new EncodedAudioChunk({
                // @ts-expect-error - Intentionally invalid
                type: 'bogus',
                timestamp: 0,
                data: new Uint8Array(3)
            })).to.throw(TypeError);
        });

        it('should accept a raw `ArrayBuffer` as `data`', () => {
            const chunk = new EncodedAudioChunk({
                type: 'key',
                timestamp: 0,
                data: new Uint8Array([1, 2, 3]).buffer
            });
            expect(chunk.byteLength).to.equal(3);
        });

        it('should throw when the destination buffer is too small', () => {
            const chunk = new EncodedAudioChunk({
                type: 'key',
                timestamp: 0,
                data: new Uint8Array([1, 2, 3])
            });
            expect(() => {
                chunk.copyTo(new Uint8Array(1));
            }).to.throw(RangeError);
        });

        it('should copy to a raw `ArrayBuffer` destination', () => {
            const chunk = new EncodedAudioChunk({
                type: 'key',
                timestamp: 0,
                data: new Uint8Array([1, 2, 3])
            });
            const dest = new ArrayBuffer(3);
            chunk.copyTo(dest);
            expect(new Uint8Array(dest)).to.deep.equal(
                new Uint8Array([1, 2, 3])
            );
        });
    });

    describe('EncodedVideoChunk', () => {
        it('should throw for an unsupported type', () => {
            expect(() => new EncodedVideoChunk({
                // @ts-expect-error - Intentionally invalid
                type: 'bogus',
                timestamp: 0,
                data: new Uint8Array(3)
            })).to.throw(TypeError);
        });

        it('should accept a raw `ArrayBuffer` as `data`', () => {
            const chunk = new EncodedVideoChunk({
                type: 'key',
                timestamp: 0,
                data: new Uint8Array([1, 2, 3]).buffer
            });
            expect(chunk.byteLength).to.equal(3);
        });

        it('should throw when the destination buffer is too small', () => {
            const chunk = new EncodedVideoChunk({
                type: 'key',
                timestamp: 0,
                data: new Uint8Array([1, 2, 3])
            });
            expect(() => {
                chunk.copyTo(new Uint8Array(1));
            }).to.throw(RangeError);
        });

        it('should copy to a raw `ArrayBuffer` destination', () => {
            const chunk = new EncodedVideoChunk({
                type: 'key',
                timestamp: 0,
                data: new Uint8Array([1, 2, 3])
            });
            const dest = new ArrayBuffer(3);
            chunk.copyTo(dest);
            expect(new Uint8Array(dest)).to.deep.equal(
                new Uint8Array([1, 2, 3])
            );
        });
    });

    describe('VideoFrame', () => {
        it('should throw for an unsupported pixel format', () => {
            /** @type {ConstructorParameters<typeof VideoFrame>[1]} */
            const init = {
                // @ts-expect-error - Intentionally invalid
                format: 'bogus',
                codedWidth: 1,
                codedHeight: 1,
                timestamp: 0
            };
            expect(() => new VideoFrame(new Uint8Array(4), init)).
                to.throw(TypeError);
        });

        it('should accept a raw `ArrayBuffer` as `data`', () => {
            const frame = new VideoFrame(new Uint8Array(16).buffer, {
                format: 'RGBA', codedWidth: 2, codedHeight: 2, timestamp: 0
            });
            expect(frame.codedWidth).to.equal(2);
        });

        it('should copy to a raw `ArrayBuffer` destination', async () => {
            const data = new Uint8Array([
                1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16
            ]);
            const frame = new VideoFrame(data, {
                format: 'RGBA', codedWidth: 2, codedHeight: 2, timestamp: 0
            });
            const dest = new ArrayBuffer(16);
            await frame.copyTo(dest);
            expect(new Uint8Array(dest)).to.deep.equal(data);
        });

        it('should throw when the destination buffer is too small', () => {
            const frame = new VideoFrame(new Uint8Array(16), {
                format: 'RGBA', codedWidth: 2, codedHeight: 2, timestamp: 0
            });
            expect(() => {
                frame.copyTo(new Uint8Array(4));
            }).to.throw(RangeError);
        });

        it('should throw for a `format` conversion request', () => {
            const frame = new VideoFrame(new Uint8Array(16), {
                format: 'RGBA', codedWidth: 2, codedHeight: 2, timestamp: 0
            });
            expect(() => {
                frame.allocationSize({format: 'I420'});
            }).to.throw(TypeError);
        });

        it('should copy a cropped `rect` region', async () => {
            const codedWidth = 4;
            const codedHeight = 4;
            const data = new Uint8Array(codedWidth * codedHeight * 4);
            for (let row = 0; row < codedHeight; row++) {
                for (let col = 0; col < codedWidth; col++) {
                    data[((row * codedWidth) + col) * 4] =
                        (row * codedWidth) + col;
                }
            }

            const frame = new VideoFrame(data, {
                format: 'RGBA', codedWidth, codedHeight, timestamp: 0
            });

            const rect = {x: 1, y: 1, width: 2, height: 2};
            const dest = new Uint8Array(frame.allocationSize({rect}));
            await frame.copyTo(dest, {rect});

            const rValues = [dest[0], dest[4], dest[8], dest[12]];
            expect(rValues).to.deep.equal([5, 6, 9, 10]);
        });

        it('should `clone` a `VideoFrame`', async () => {
            const data = new Uint8Array([
                1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16
            ]);
            const frame = new VideoFrame(data, {
                format: 'RGBA', codedWidth: 2, codedHeight: 2, timestamp: 5
            });
            const clone = frame.clone();
            expect(clone).to.not.equal(frame);
            expect(clone.format).to.equal('RGBA');
            expect(clone.timestamp).to.equal(5);

            const dest = new Uint8Array(clone.allocationSize());
            await clone.copyTo(dest);
            expect(dest).to.deep.equal(data);
        });

        it('should throw when using a `close`d `VideoFrame`', () => {
            const frame = new VideoFrame(new Uint8Array(16), {
                format: 'RGBA', codedWidth: 2, codedHeight: 2, timestamp: 0
            });
            frame.close();
            expect(frame.format).to.be.null;
            expect(() => {
                frame.allocationSize();
            }).to.throw(DOMException);
        });
    });

    describe('DOMMatrixReadOnly', () => {
        it('should construct a 3D `DOMMatrixReadOnly`', () => {
            const domMatrix = new DOMMatrixReadOnly([
                1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16
            ]);
            expect(domMatrix.is2D).to.be.false;
            expect(domMatrix.m11).to.equal(1);
            expect(domMatrix.m44).to.equal(16);
        });

        it(
            'should default `DOMMatrixReadOnly` to the 2D identity matrix ' +
                'when `init` is omitted',
            () => {
                const domMatrix = new DOMMatrixReadOnly();
                expect(domMatrix.is2D).to.be.true;
                expect(domMatrix.a).to.equal(1);
                expect(domMatrix.b).to.equal(0);
                expect(domMatrix.c).to.equal(0);
                expect(domMatrix.d).to.equal(1);
                expect(domMatrix.e).to.equal(0);
                expect(domMatrix.f).to.equal(0);
            }
        );
    });

    describe('DOMMatrix', () => {
        it(
            'should default `DOMMatrix` to the 2D identity matrix when ' +
                '`init` is omitted',
            () => {
                const domMatrix = new DOMMatrix();
                expect(domMatrix.is2D).to.be.true;
                expect(domMatrix.a).to.equal(1);
                expect(domMatrix.b).to.equal(0);
                expect(domMatrix.c).to.equal(0);
                expect(domMatrix.d).to.equal(1);
                expect(domMatrix.e).to.equal(0);
                expect(domMatrix.f).to.equal(0);
            }
        );
    });

    describe('DOMPoint', () => {
        it('should default `DOMPoint` properties when omitted', () => {
            const domPoint = new DOMPoint();
            expect(domPoint.x).to.equal(0);
            expect(domPoint.y).to.equal(0);
            expect(domPoint.z).to.equal(0);
            expect(domPoint.w).to.equal(1);
        });

        it(
            'should default `DOMPointReadOnly` properties when omitted',
            () => {
                const domPoint = new DOMPointReadOnly();
                expect(domPoint.x).to.equal(0);
                expect(domPoint.y).to.equal(0);
                expect(domPoint.z).to.equal(0);
                expect(domPoint.w).to.equal(1);
            }
        );
    });

    describe('DOMQuad', () => {
        it('should default `DOMQuad` points when omitted', () => {
            const domQuad = new DOMQuad();
            const defaultPoint = new DOMPoint(0, 0, 0, 1);
            expect(domQuad.p1).to.deep.equal(defaultPoint);
            expect(domQuad.p2).to.deep.equal(defaultPoint);
            expect(domQuad.p3).to.deep.equal(defaultPoint);
            expect(domQuad.p4).to.deep.equal(defaultPoint);
        });
    });

    describe('QuotaExceededError', () => {
        it('should throw for a negative `quota`', () => {
            expect(() => new QuotaExceededError('Not enough room', {
                quota: -1
            })).to.throw(RangeError);
        });

        it('should throw for a negative `requested`', () => {
            expect(() => new QuotaExceededError('Not enough room', {
                requested: -1
            })).to.throw(RangeError);
        });

        it('should throw when `requested` is less than `quota`', () => {
            expect(() => new QuotaExceededError('Not enough room', {
                quota: 100, requested: 50
            })).to.throw(RangeError);
        });
    });

    describe('WebTransportError', () => {
        it('should expose the default `source`', () => {
            // @ts-expect-error - More recent API (single `init` argument)
            const exc = new WebTransportError({message: 'Stream reset'});
            expect(exc.source).to.equal('stream');
        });

        it('should expose a custom `source`', () => {
            // @ts-expect-error - More recent API (single `init` argument)
            const exc = new WebTransportError({
                message: 'Session closed', source: 'session'
            });
            expect(exc.source).to.equal('session');
        });
    });

    describe('createImageBitmap', () => {
        it('should add a `dataset` when missing', async () => {
            const obj = /** @type {ImageBitmapSource} */ ({});
            const result = /** @type {unknown} */ (
                await createImageBitmap(obj)
            );
            const {dataset} = /** @type {{dataset: {toStringTag?: string}}} */ (
                result
            );
            expect(dataset.toStringTag).to.equal('ImageBitmap');
        });
    });
});
