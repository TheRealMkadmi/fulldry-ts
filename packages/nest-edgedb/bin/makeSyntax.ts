import { syntax } from "@edgedb/generate/dist/FILES";
import { mkdir, rm, writeFileSync } from "fs";
import { cwd } from "process";

const ts = syntax["ts"];

const syntaxDir = "./syntax";

for (const file of ts) {
    console.log(`Writing ${file.path}`);

    writeFileSync(`${syntaxDir}/${file.path}`, file.content) // probably better with os.join
}

