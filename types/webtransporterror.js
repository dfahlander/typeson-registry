/* globals WebTransportError -- Newer API */
import {toStringTag} from 'typeson';

/**
 * @type {import('typeson').TypeSpecSet}
 */
const webtransporterror = {
    webtransporterror: {
        test (x) { return toStringTag(x) === 'WebTransportError'; },
        // Note that we can't support the `source` property (defaults
        //   to `stream` instead of `session`)
        replace ({message, streamErrorCode}) {
            return {message, streamErrorCode};
        },
        revive ({message, streamErrorCode}) {
            // TS lib still models the older two-argument
            //   `(message, options)` form; browsers implement a single
            //   `init` object (which also carries `message`).
            // @ts-expect-error - More recent API
            return new WebTransportError({message, streamErrorCode});
        }
    }
};

export default webtransporterror;
