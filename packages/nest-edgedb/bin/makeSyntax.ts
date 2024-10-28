import { syntax } from "@edgedb/generate/dist/FILES";
import { writeFileSync } from "fs";

const ts = syntax["ts"];

for (const file of ts) {
    console.log(`Writing ${file.path}`);
    writeFileSync(file.path, file.content)
}

