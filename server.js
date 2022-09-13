import express from "express";
import path from "path";
const app = express();
const port = 3000;
const __dirname = path.resolve();
app.use(express.static(__dirname));

app.get("/*", (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

app.listen(port, () => {
  console.log(`This app listening on port ${port}`);
});
