import {writeFile} from 'fs/promises';

const exportTypes = `
export type * from 'typeson';
`;

await writeFile('dist/index.d.ts', exportTypes, {flag: 'a+'});
