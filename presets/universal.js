import builtin from './builtin.js';

/**
 * @type {import('typeson').Preset}
 */
const universal = [
    builtin
    // TODO: Add types that are de-facto universal even though not
    //   built-in into ecmasript standard.
];

export default universal;
