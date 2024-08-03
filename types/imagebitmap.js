/* globals document, OffscreenCanvas, createImageBitmap -- Polyfills */
// `ImageBitmap` is browser / DOM specific. It also can only work
//  same-domain (or CORS)

import {toStringTag, TypesonPromise} from 'typeson';

/**
 * @type {import('typeson').TypeSpecSet}
 */
const imagebitmap = {
    imagebitmap: {
        test (x) {
            return toStringTag(x) === 'ImageBitmap' ||
                // In Node, our polyfill sets the dataset on a canvas
                //  element as JSDom no longer allows overriding toStringTag
                (x && x.dataset && x.dataset.toStringTag === 'ImageBitmap');
        },
        replace (bm) {
            const canvas = document.createElement('canvas');
            const ctx = /** @type {CanvasRenderingContext2D} */ (
                canvas.getContext('2d')
            );
            ctx.drawImage(bm, 0, 0);
            return {
                width: bm.width, height: bm.height, dataURL: canvas.toDataURL()
            };
        },
        revive (o) {
            const canvas = typeof OffscreenCanvas === 'undefined'
                ? document.createElement('canvas')
                /* c8 ignore next -- Browser only */
                : new OffscreenCanvas(o.width, o.height);
            /*
            var req = new XMLHttpRequest();
            req.open('GET', o, false); // Sync
            if (req.status !== 200 && req.status !== 0) {
              throw new Error('Bad ImageBitmap access: ' + req.status);
            }
            req.send();
            return req.responseText;
            */
            const ctx = /** @type {CanvasRenderingContext2D} */ (
                canvas.getContext('2d')
            );
            const img = document.createElement('img');
            // The onload is needed by some browsers per http://stackoverflow.com/a/4776378/271577
            img.addEventListener('load', function () {
                ctx.drawImage(img, 0, 0);
            });
            img.src = o.dataURL;
            // Works in contexts allowing an `ImageBitmap` (We might use
            //   `OffscreenCanvas.transferToBitmap` when supported)
            return typeof OffscreenCanvas === 'undefined'
                ? canvas
                /* c8 ignore next 3 -- Browser only */
                : /** @type {OffscreenCanvas} */ (
                    canvas
                ).transferToImageBitmap();
        },
        reviveAsync (o) {
            const canvas = document.createElement('canvas');
            const ctx = /** @type {CanvasRenderingContext2D} */ (
                canvas.getContext('2d')
            );
            const img = document.createElement('img');
            // The onload is needed by some browsers per http://stackoverflow.com/a/4776378/271577
            img.addEventListener('load', function () {
                ctx.drawImage(img, 0, 0);
            });
            img.src = o.dataURL;

            return new TypesonPromise(async (resolve, reject) => {
                try {
                    const resp = await createImageBitmap(canvas);
                    resolve(resp);
                /* c8 ignore next 3 */
                } catch (err) {
                    reject(err);
                }
            });
        }
    }
};

export default imagebitmap;
