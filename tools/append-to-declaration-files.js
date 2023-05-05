import {readFile, writeFile} from 'fs/promises';

const exportTypes = `
export type * from 'typeson';
`;

const filePath = 'dist/index.d.ts';

const contents = await readFile(filePath, 'utf8');

if (!contents.includes(exportTypes)) {
    await writeFile(filePath, exportTypes, {flag: 'a+'});
}
