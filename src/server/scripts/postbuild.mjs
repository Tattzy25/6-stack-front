import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const entryUrl = new URL('../dist/api.js', import.meta.url);
const entryPath = fileURLToPath(entryUrl);
await mkdir(dirname(entryPath), { recursive: true });

const shim = "import './server/api.js';\n";
await writeFile(entryPath, shim);
