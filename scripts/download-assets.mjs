import { mkdir, writeFile } from 'node:fs/promises';

const icons = [
  ['react', 'react-original'], ['typescript', 'typescript-original'],
  ['php', 'php-original'], ['javascript', 'javascript-original'],
  ['tailwindcss', 'tailwindcss-original'], ['html5', 'html5-original'],
  ['css3', 'css3-original'], ['nodejs', 'nodejs-original'],
  ['supabase', 'supabase-original'], ['csharp', 'csharp-original'],
];
await mkdir('public/icons', { recursive: true });
await Promise.all(icons.map(async ([folder, name]) => {
  const response = await fetch(`https://raw.githubusercontent.com/devicons/devicon/master/icons/${folder}/${name}.svg`);
  if (!response.ok) throw new Error(`${name}: HTTP ${response.status}`);
  await writeFile(`public/icons/${folder}.svg`, await response.text());
  process.stdout.write(`Saved ${folder}\n`);
}));
const license = await fetch('https://raw.githubusercontent.com/devicons/devicon/master/LICENSE');
if (!license.ok) throw new Error(`License: HTTP ${license.status}`);
await writeFile('public/icons/LICENSE.txt', await license.text());
