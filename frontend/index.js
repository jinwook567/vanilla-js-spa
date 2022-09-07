import { Book, BookList } from "./components.js";

class SampleBook {
  constructor() {
    this.image = "https://image.yes24.com/goods/105655620/XL";
    this.name = "월가를 위한 퀀트투자 바이블";
  }
}

const book = new SampleBook();

// BookList([book, book])
const routes = [
  { path: "/", component: BookList([book, book, book]), exact: true },
  { path: "/detail", component: "<div>book data</div>", exact: false },
];

const $app = document.getElementById("app");

const render = (path) => {
  console.log("render run");
  const component =
    routes.find((v) => (v.exact ? v.path === path : v.path.includes(path)))?.component ||
    "<div>Not Found</div>";

  console.log(component);
  $app.replaceChildren(component);
};

window.addEventListener("DOMContentLoaded", () => render(window.location.pathname));
