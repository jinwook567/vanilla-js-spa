import { BookList, BookDetail, NotFound } from "./components.js";
import { $app } from "./index.js";
import { getJSON } from "./index.js";

const routes = [
  { path: "/", component: BookList, exact: true },
  { path: "/detail", component: BookDetail, exact: false },
];

const render = async (path) => {
  const component =
    routes.find((v) => (v.exact ? v.path === path : path.includes(v.path)))?.component || NotFound;

  $app.replaceChildren(await component());
};

const historyPush = (path) => {
  history.pushState({}, "", path);
  render(path);
};

//뒤로 가기, 앞으로 가기 렌더링
window.addEventListener("popstate", () => render(window.location.pathname));

//초기 렌더링
window.addEventListener("DOMContentLoaded", async () => {
  render(window.location.pathname);
});

export { historyPush };
