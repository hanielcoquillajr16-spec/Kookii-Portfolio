import { mkdir, writeFile } from 'node:fs/promises';
const font = await fetch('https://rsms.me/inter/font-files/InterVariable.woff2');
if (!font.ok) throw new Error(`Font returned HTTP ${font.status}`);
await mkdir('public/fonts', { recursive: true });
await writeFile('public/fonts/inter-latin.woff2', new Uint8Array(await font.arrayBuffer()));
const license = await fetch('https://raw.githubusercontent.com/rsms/inter/master/LICENSE.txt');
if (!license.ok) throw new Error(`Font license returned HTTP ${license.status}`);
await writeFile('public/fonts/LICENSE.txt', await license.text());
console.log('Saved local Inter variable font and license');
