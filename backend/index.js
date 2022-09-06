import express from "express";
import { open, readdir } from "node:fs/promises";
import path from "path";

const app = express();
const port = 3000;

app.use(express.static("frontend"));

app.get("/*", (req, res) => {
  console.log(req.path);
  const __dirname = path.resolve();
  res.sendFile(`${__dirname}/frontend/index.html`);
});

//정적 콘텐츠 제공하는 방식으로 제공할 예정이라 주석 처리 하였음.
// app.get("/:name", async (req, res) => {
//   try {
//     const files = await readdir(`backend/posts/${req.params.name}`);
//     console.log(files);
//     res.send(files);
//   } catch (err) {
//     res.send(err);
//     //에러 전달.
//   }
// });

app.listen(port, () => {
  console.log(`This app listening on port ${port}`);
});
