import { adapter, type Client } from "edgedb";
import { generateIndex } from "@edgedb/generate/dist/edgeql-js/generateIndex";
import { GeneratorParams } from "@edgedb/generate/dist/genutil";
import { DirBuilder } from "@edgedb/generate/dist/builders";
import { syntax } from "@edgedb/generate/dist/FILES";

const { path, fs, readFileUtf8, exists } = adapter;


const outputDir = path.join(__dirname, "..", "src", "generated", "syntax");

export async function generateQueryBuilder() {
    const dir = new DirBuilder();
    const generatorParams = {
        dir
    } as GeneratorParams;

    const written = new Set<string>();


    // write syntax files
    const syntaxOutDir = path.join(outputDir);
    if (!(await exists(syntaxOutDir))) {
        await fs.mkdir(syntaxOutDir);
    }

    const syntaxFiles = syntax["ts"];

    const importsFile = dir.getPath("imports");

    importsFile.addExportStar("edgedb", { as: "edgedb" });
    importsFile.addExportFrom({ spec: true }, "./__spec__", {
        allowFileExt: true,
    });
    importsFile.addExportStar("./syntax", {
        allowFileExt: true,
        as: "syntax",
    });
    importsFile.addExportStar("./castMaps", {
        allowFileExt: true,
        as: "castMaps",
    });


    console.log(`Writing files to ${syntaxOutDir}`);

    generateIndex(generatorParams);

    console.log(`Generation complete! 🤘`);

    dir.write(outputDir, {
        mode: "ts",
        moduleKind: "esm",
        fileExtension: ".ts",
        moduleExtension: "",
        written
    });
    const stdLibs = ["cal", "fts", "math", "pg"];
    for (const f of syntaxFiles) {
        const outputPath = path.join(syntaxOutDir, f.path);
        const oldContents = await readFileUtf8(outputPath).catch(() => "");
        let newContents = f.content;
        stdLibs.forEach((lib) => {
            newContents = newContents.replace(
                `modules/${lib}`,
                `modules/std/${lib}`,
            );
        });


        if (oldContents !== newContents) {
            await fs.writeFile(outputPath, newContents);
        }
    }


}

generateQueryBuilder()
    .then(() => {
        console.log("Done!");
        process.exit(0);
    })
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });