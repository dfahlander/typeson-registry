// Node-only: exercises `polyfills/createImageBitmap.js`
//   (`buildCanvasPolyfills`) directly, against the real `canvas` package,
//   rather than through the jsdom-based globals that `test/test.js`
//   (shared with `browser-test/`) relies on.
import fs from 'node:fs';
import path from 'node:path';

import {expect} from 'chai';
import * as canvas from 'canvas';

import {buildCanvasPolyfills} from '../polyfills/buildCanvasPolyfills.js';

const {
    ImageBitmap, OffscreenCanvas, createImageBitmap
} = buildCanvasPolyfills(canvas);

const pngPath = path.join(
    import.meta.dirname, 'helpers', 'Flag_of_the_United_Nations.png'
);
// eslint-disable-next-line n/no-sync -- Deliberate (one-time test setup)
const pngBuffer = fs.readFileSync(pngPath);

describe('createImageBitmap/OffscreenCanvas polyfills (Node `canvas`)', () => {
    describe('createImageBitmap', () => {
        it('should create an `ImageBitmap` from a `Blob`', async () => {
            const blob = new Blob([pngBuffer]);
            const bitmap = await createImageBitmap(blob);
            expect(bitmap).to.be.an.instanceOf(ImageBitmap);
            expect(bitmap.width).to.equal(1024);
            expect(bitmap.height).to.equal(683);
        });

        it('should create an `ImageBitmap` from a `Buffer`', async () => {
            const bitmap = await createImageBitmap(
                /** @type {ImageBitmapSource} */ (
                    /** @type {unknown} */ (pngBuffer)
                )
            );
            expect(bitmap.width).to.equal(1024);
        });

        it(
            'should create an `ImageBitmap` from a file path string',
            async () => {
                const bitmap = await createImageBitmap(
                    /** @type {ImageBitmapSource} */ (
                        /** @type {unknown} */ (pngPath)
                    )
                );
                expect(bitmap.width).to.equal(1024);
            }
        );

        it(
            'should create an `ImageBitmap` from a canvas-like source ' +
            'exposing `toBuffer`',
            async () => {
                const cvs = canvas.createCanvas(10, 12);
                const bitmap = await createImageBitmap(
                    /** @type {ImageBitmapSource} */ (
                        /** @type {unknown} */ (cvs)
                    )
                );
                expect(bitmap.width).to.equal(10);
                expect(bitmap.height).to.equal(12);
            }
        );

        it(
            'should create an `ImageBitmap` from a canvas-like source ' +
            'exposing only `toDataURL`',
            async () => {
                const cvs = canvas.createCanvas(10, 12);
                const dataURLOnly = {toDataURL: () => cvs.toDataURL()};
                const bitmap = await createImageBitmap(
                    /** @type {ImageBitmapSource} */ (
                        /** @type {unknown} */ (dataURLOnly)
                    )
                );
                expect(bitmap.width).to.equal(10);
                expect(bitmap.height).to.equal(12);
            }
        );

        it('should throw for an unsupported source type', async () => {
            let thrown;
            try {
                await createImageBitmap(
                    /** @type {ImageBitmapSource} */ (
                        /** @type {unknown} */ (42)
                    )
                );
            } catch (err) {
                thrown = err;
            }
            expect(thrown).to.be.an.instanceOf(Error);
            expect(/** @type {Error} */ (thrown).message).to.equal(
                'Unsupported source type for createImageBitmap polyfill'
            );
        });
    });

    describe('ImageBitmap', () => {
        it('should reset `src`/`width`/`height` on `close`', async () => {
            const bitmap = await createImageBitmap(
                /** @type {ImageBitmapSource} */ (
                    /** @type {unknown} */ (pngBuffer)
                )
            );
            bitmap.close();
            expect(bitmap.src).to.equal('');
            expect(bitmap.width).to.equal(0);
            expect(bitmap.height).to.equal(0);
        });
    });

    describe('OffscreenCanvas', () => {
        it('should get and set `width`/`height`', () => {
            const oc = new OffscreenCanvas(10, 20);
            expect(oc.width).to.equal(10);
            expect(oc.height).to.equal(20);
            oc.width = 30;
            oc.height = 40;
            expect(oc.width).to.equal(30);
            expect(oc.height).to.equal(40);
        });

        it('should return a 2d rendering context', () => {
            const oc = new OffscreenCanvas(10, 10);
            expect(oc.getContext('2d')).to.be.ok;
        });

        it('should throw for an unsupported context type', () => {
            const oc = new OffscreenCanvas(10, 10);
            expect(() => oc.getContext(
                /** @type {"2d"|"3d"} */ (/** @type {unknown} */ ('3d'))
            )).to.throw(
                'Context type "3d" is not polyfilled in Node.js.'
            );
        });

        it('should `transferToImageBitmap`', () => {
            const oc = new OffscreenCanvas(10, 12);
            const ctx = oc.getContext('2d');
            ctx.fillRect(0, 0, 10, 12);
            const bitmap = oc.transferToImageBitmap();
            expect(bitmap).to.be.an.instanceOf(ImageBitmap);
            expect(bitmap.width).to.equal(10);
            expect(bitmap.height).to.equal(12);
        });

        it('should `convertToBlob` with the default type', async () => {
            const oc = new OffscreenCanvas(10, 10);
            const blob = await oc.convertToBlob();
            expect(blob).to.be.an.instanceOf(Blob);
            expect(blob.type).to.equal('image/png');
            expect(blob.size).to.be.above(0);
        });

        it('should `convertToBlob` with a custom `type`', async () => {
            const oc = new OffscreenCanvas(10, 10);
            const blob = await oc.convertToBlob({type: 'image/jpeg'});
            expect(blob.type).to.equal('image/jpeg');
        });

        it(
            'should reject `convertToBlob` when the underlying `toBuffer` ' +
            'call errors',
            async () => {
                // A 0x0 canvas is not a valid surface to encode.
                const oc = new OffscreenCanvas(0, 0);
                let thrown;
                try {
                    await oc.convertToBlob();
                } catch (err) {
                    thrown = err;
                }
                expect(thrown).to.be.an.instanceOf(Error);
            }
        );
    });
});
