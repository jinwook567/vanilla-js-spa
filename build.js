import path from "path";
import { readdir, readFile, writeFile } from "node:fs/promises";
import MarkDownIt from "markdown-it";

const mdFolderRelativePathInPublicFolder = "./books";
const jsonFolderRelativePathInPublicFolder = "./data";

class Markdown extends MarkDownIt {
  async readFileInStringForm(path) {
    const mdStr = await readFile(path, "utf8");
    return mdStr;
  }

  // changeImagePathOfMdRenderer() {
  //   console.log("hi");
  // }
}

// TODO: public의 하위 폴더의 이름을 받아서 public과의 상대 경로를 구해주는 함수 만들기. BFS로 만들기.
const createRelativePathInPublic = (relativePath, rootFolderName) => {
  if (isRelativePath(path)) {
    path = path.replace("./", "");
    return `${relativePath}/${path}`;
  } else {
    return path;
  }
};

const isRelativePath = (path) => {
  return !path.match(/^http[s]*:\/\//) && !path.match(/^data:image/);
};

const createAbsolutePathByRelativePathInPublic = (relativePathInPublic) => {
  const directoryArr = relativePathInPublic.replace("./", "").split("/");
  return path.resolve("public", ...directoryArr);
};

const md = new Markdown();

async function parseMdFolderToJSON() {
  try {
    const mdFolderPath = getAbsolutePathInPublicByRelativePath(mdFolderRelativePathInPublicFolder);
    const mdFolders = await readdir(mdFolderPath);

    const data = await Promise.all(
      mdFolders.map(async (folderName, index) => {
        const mdStr = await readMdFile(`${mdFolderPath}/${folderName}`);
        const infomation = createCardInfomation(mdStr, folderName);
        changeImagePathOfMdRenderer(md, `${mdFolderRelativePathInPublicFolder}/${folderName}`);
        const text = createHTMLByMd(mdStr);
        return { name: folderName, id: index, text, ...infomation };
      })
    );

    const jsonPath = getAbsolutePathInPublicByRelativePath(
      `${jsonFolderRelativePathInPublicFolder}/book-data.json`
    );
    await writeFile(jsonPath, JSON.stringify(data));
  } catch (e) {
    console.error(e);
  }
}

const readMdFile = async (path) => {
  try {
    const content = await readFile(`${path}/index.md`, "utf8");
    return content;
  } catch (e) {
    console.error(e);
    throw "md 파일 읽기 실패. 파일명이 index.md인지 확인" + path;
  }
};

function createCardInfomation(mdStr, folderName) {
  const raw = mdStr.match(/---[\d\D]*---/);
  const obj = {};
  if (raw) {
    const temp = raw[0].split("\n");
    const keyValues = temp.slice(1, temp.length - 1);
    keyValues.forEach((v) => {
      const [key, value] = v.split(":");
      obj[key] = value.trim();
    });

    if (!obj.image)
      throw "썸네일 프로퍼티가 존재하지 않습니다. ---\nthumbnail:(image)\n--- 형태로 삽입해주세요.";

    obj.image = changeImagePath(obj.image, `${mdFolderRelativePathInPublicFolder}/${folderName}`);
  }
  return obj;
}

const changeImagePathOfMdRenderer = (md, relativeFolderPath) => {
  const temp = md.renderer.rules.image;
  md.renderer.rules.image = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    const aIndex = token.attrIndex("src");
    token.attrs[aIndex][1] = changeImagePath(token.attrs[aIndex][1], relativeFolderPath);
    return temp(tokens, idx, options, env, self);
  };
};

function createHTMLByMd(mdStr) {
  const eleminatedCardInfomationStr = mdStr.replace(/---[\d\D]*---/, "");
  const rendered = md.render(eleminatedCardInfomationStr);
  return rendered;
}

parseMdFolderToJSON();

//어떻게 하면 유연한 아키텍쳐를 짤 수 있을까...?
//오류가 파고들 틈이 없을 만큼 짧은 함수들로 구성해보자..

//이미지의 경로를 만들어주어야 한다.

//1. ---,--- 안에 들어간 jpeg, jpg, png 파일을 변형시킨다.
//2. image 태그 안에 들어간 jpeg, jpg, png 파일의 경로를 변형시킨다.

//1의 경우에 객체의 key에 .jpg가 들어갈 수도 있으므로, :에 대해서 분리한 부분에 대해서만 처리를 해줘야 한다. 이게 아니고, 규약한 일부 객체 프로퍼티만 이미지 경로로 바꿔준다.
//경로가 http, https라면 폴더 경로를 바꿔주면 안된다.

async function makeBookDataJSON() {
  try {
    const __dirname = path.resolve();
    const folderPath = `${__dirname}/${mdFolderRelativePathInPublicFolder.replace("./", "public")}`;

    const folders = await readdir(folderPath);

    const data = await Promise.all(
      folders.map(async (folder, index) => {
        const content = await readFile(`${folderPath}/${folder}/index.md`, "utf8");
        const infoObj = extractInfomationObj(content);

        const body = content.replace(/---[\d\D]*---/, "");

        const text = md.render(body);

        return { name: folder, id: index, text, ...infoObj };
      })
    );

    await writeFile(`${__dirname}/public/data/book-data.json`, JSON.stringify(data));
  } catch (e) {
    console.log(e);
  }
}
