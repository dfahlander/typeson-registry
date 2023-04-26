import nan from '../types/nan.js';
import infinity from '../types/infinity.js';
import negativeInfinity from '../types/negative-infinity.js';
import negativeZero from '../types/negative-zero.js';

/**
 * @type {import('typeson').Preset}
 */
const specialNumbers = [
    nan,
    infinity,
    negativeInfinity,
    negativeZero
];

export default specialNumbers;
