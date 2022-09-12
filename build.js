import path from "path";
import { open, readdir, readFile, writeFile } from "node:fs/promises";

//파일 디렉토리를 읽고, 이것들을 name 프로퍼티로 설정한다.
//id를 index로 넣어준다.
//text 프로퍼티에 md의 내용을 그대로 넣어놓는다.

async function makeBookDataJSON() {
  try {
    const __dirname = path.resolve();
    const folderPath = `${__dirname}/books`;
    const folders = await readdir(folderPath);

    const data = await Promise.all(
      folders.map(async (folder, index) => {
        const text = await readFile(`${folderPath}/${folder}/index.md`, "utf-8");
        return { name: folder, id: index, text };
      })
    );

    await writeFile(`${__dirname}/book-data.json`, JSON.stringify(data));
  } catch (e) {
    console.log(e);
  }
}

makeBookDataJSON();
