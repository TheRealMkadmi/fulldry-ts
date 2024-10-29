import { syntax } from "@edgedb/generate/dist/FILES";
import { mkdir, rm, writeFileSync } from "fs";
import { cwd } from "process";
import { generateIndex } from "@edgedb/generate/dist/edgeql-js/generateIndex";
import { DirBuilder } from "@edgedb/generate/dist/builders";
import { GeneratorParams } from "@edgedb/generate/dist/genutil";

const ts = syntax["ts"];

const syntaxDir = "./src/generated/syntax";

// probably should clean up the directory first
console.log(`Generating syntax directory`);
for (const file of ts) {
    console.log(`Writing ${file.path}`);
    writeFileSync(`${syntaxDir}/${file.path}`, file.content) // probably better with os.join
}

console.log(`Generating index`);

const dir = new DirBuilder();

generateIndex({ dir } as GeneratorParams);

console.log(`Writing index`);
dir.write(syntaxDir, {
    mode: 'ts',
    moduleKind: 'esm',
    fileExtension: '.ts',
    moduleExtension: '',
    written: new Set()
})