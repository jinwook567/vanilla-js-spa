import express from "express";
import path from "path";
const app = express();
const port = 3000;
const __dirname = path.resolve();
app.use(express.static("public"));
app.use(express.static("books"));

app.get("/*", (req, res) => {
  res.sendFile(`${__dirname}/public/index.html`);
});

app.listen(port, () => {
  console.log(`This app listening on port ${port}`);
});
