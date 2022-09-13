import path from "path";
import { readdir, readFile, writeFile } from "node:fs/promises";
import MarkDownIt from "markdown-it";

const md = new MarkDownIt();

async function makeBookDataJSON() {
  try {
    const __dirname = path.resolve();
    const folderPath = `${__dirname}/books`;
    const folders = await readdir(folderPath);

    const data = await Promise.all(
      folders.map(async (folder, index) => {
        const content = await readFile(`${folderPath}/${folder}/index.md`, "utf8");
        const text = md.render(content);
        return { name: folder, id: index, text };
      })
    );

    await writeFile(`${__dirname}/book-data.json`, JSON.stringify(data));
  } catch (e) {
    console.log(e);
  }
}

makeBookDataJSON();
