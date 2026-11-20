// News-image entry (Node 22, standard library only): the poster lives in this
// repository as entry.png, and this program copies it to the output directory
// as entry.png. It reads no network and writes the same bytes on every run.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const source = new URL('./entry.png', import.meta.url);
const target = join(outDir, 'entry.png');

mkdirSync(outDir, { recursive: true });
copyFileSync(source, target);
console.log(`wrote ${target} (${statSync(target).size} bytes)`);
