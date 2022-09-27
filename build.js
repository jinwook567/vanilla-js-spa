import path from "path";
import { readdir, readFile, writeFile } from "node:fs/promises";
import MarkDownIt from "markdown-it";

const mdFolderRelativePathInPublicFolder = "./books";
const jsonFolderRelativePathInPublicFolder = "./data";

class Markdown extends MarkDownIt {
  changeRenderImageRelativePathPublicAsRoot(currentRelativePathInPublic) {
    const temp = this.renderer.rules.image;
    this.renderer.rules.image = (tokens, idx, options, env, self) => {
      const token = tokens[idx];
      const aIndex = token.attrIndex("src");

      token.attrs[aIndex][1] = changeRelativePathPublicAsRoot(
        token.attrs[aIndex][1],
        currentRelativePathInPublic
      );

      return temp(tokens, idx, options, env, self);
    };
  }
}

const mdStr = {
  async read(path) {
    return await readFile(path, "utf8");
  },
  separateNodeFieldAndBody(str) {
    const nodeFieldRaw = str.match(/---[\d\D]*---/);
    const nodeFieldStr = nodeFieldRaw ? nodeFieldRaw[0] : "";
    const bodyStr = str.replace(/---[\d\D]*---/, "");
    return { nodeFieldStr, bodyStr };
  },
  createNodeField(nodeFieldStr) {
    if (!nodeFieldStr.match(/---[\d\D]*---/))
      throw new Error("nodeField 영역이 존재하지 않습니다.");

    const field = {};
    const temp = nodeFieldStr.split("\n");
    const keyValues = temp.slice(1, temp.length - 1);
    keyValues.forEach((v) => {
      const temp = v.split(":");
      const key = temp[0];
      const value = temp.slice(1).join(":");
      field[key] = value.trim();
    });

    return field;
  },
};

const relativePathInPublic = {
  changePublicAsRoot(relativePath, currentRelativePathInPublic) {
    if (!this.isRelativePath(relativePath)) return relativePath;
    const folderArr = currentRelativePathInPublic.split("/");

    for (let i = 0; i < relativePath.lenght; i += 3) {
      if (relativePath.slice(i, i + 3) === "../") {
        folderArr.pop();
      } else {
        break;
      }
    }

    if (folderArr.length === 0) {
      throw new Error("참조하는 상대 경로가 public 폴더 내부에 있지 않습니다.");
    }

    return encodeURI(`${currentRelativePathInPublic}/${relativePath.replace("./", "")}`);
  },

  createAbsolutePath(relativePathInPublic) {
    const directoryArr = relativePathInPublic.replace("./", "").split("/");
    return path.resolve("public", ...directoryArr);
  },

  isRelativePath(path) {
    return !path.match(/^http[s]*:\/\//) && !path.match(/^data:image/);
  },
  createPathByAbsolutePath(absolutePath) {
    const folderArr = absolutePath.split("/");
    const index = folderArr.findIndex((v) => v === "public");
    folderArr[index] = ".";
    return folderArr.slice(index).join("/");
  },
};

const md = new Markdown();

async function parseMdFolderToJSON() {
  try {
    const absoluteMdFolderPath = relativePathInPublic.createAbsolutePath(
      mdFolderRelativePathInPublicFolder
    );

    const mdFolders = await readdir(absoluteMdFolderPath);

    const data = await Promise.all(
      mdFolders.map(async (folderName, index) => {
        const currentAbsolutePath = `${absoluteMdFolderPath}/${folderName}`;

        const mdStrRaw = await mdStr.read(`${currentAbsolutePath}/index.md`);

        const currentRelativePathInPublic =
          relativePathInPublic.createPathByAbsolutePath(currentAbsolutePath);

        md.changeRenderImageRelativePathPublicAsRoot(currentRelativePathInPublic);

        const { nodeFieldStr, bodyStr } = mdStr.separateNodeFieldAndBody(mdStrRaw);
        const html = md.render(bodyStr);

        const nodeField = mdStr.createNodeField(nodeFieldStr);

        if (!nodeField.coverImage)
          throw new Error(
            "커버 이미지는 필수입니다. \n---\ncoverImage:path\n---" +
              "\n형식으로 기입해주세요." +
              "\n책이름:" +
              folderName
          );

        nodeField.coverImage = relativePathInPublic.changePublicAsRoot(
          nodeField.coverImage,
          currentRelativePathInPublic
        );

        return { id: index, ...nodeField, html, name: folderName };
      })
    );

    const absoluteJSONFolderPath = relativePathInPublic.createAbsolutePath(
      `${jsonFolderRelativePathInPublicFolder}/book-data.json`
    );

    await writeFile(absoluteJSONFolderPath, JSON.stringify(data));
    console.log("build complete");
  } catch (e) {
    console.error(e);
  }
}

parseMdFolderToJSON();

//public 폴더 아래, 같은 폴더명이 있을 경우 문제가 발생할 수 있어 사용하지 않기로함.
const findFolderInPublic = async (folderName) => {
  //파일이 그렇게 많지 않으므로 큐를 단순 array로 구현. BFS 탐색
  const queue = [];
  queue.push(["public"]);
  while (queue.length) {
    try {
      const folderArr = queue.shift();
      const lastSubFolder = folderArr[folderArr.length - 1];

      if (lastSubFolder === folderName) return folderArr.join("/").replace("public", ".");

      const folders = await readdir(path.resolve(...folderArr));
      folders.forEach((folder) => queue.push([...folderArr, folder]));
    } catch (e) {
      if (e.code === "ENOTDIR") {
        //폴더가 아닐 경우 발생하는 에러는 건너뜀.
        continue;
      }
      console.error(e);
    }
  }
  throw new Error("no folder");
};
