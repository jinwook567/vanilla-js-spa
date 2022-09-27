import { BookList, BookDetail, NotFound, ErrorMesasge } from "./components.js";
import { $app, asyncFetch } from "./utils.js";

const routes = [
  { path: "/", component: BookList, exact: true },
  { path: "/detail", component: BookDetail, exact: false },
];

function createHomePageFetcher() {
  let homepage = window.location.origin;
  let isExcuted = false;

  return {
    async read() {
      if (isExcuted) return homepage;

      try {
        const response = await asyncFetch("./data/homepage.json");
        if (response.includes(window.location.origin)) {
          homepage = response;
        }
      } catch (e) {
        //homepage.json이 없는 경우.
      } finally {
        isExcuted = true;
        return homepage;
      }
    },

    async changePath(path) {
      if (!isExcuted) await this.read();

      const subpath = homepage.slice(window.location.origin.length, homepage.length);
      return `${subpath}${path}`;
    },
  };
}

const homepageFetcher = createHomePageFetcher();

const render = async (path) => {
  path = await homepageFetcher.changePath(path);

  const component =
    routes.find((v) => (v.exact ? v.path === path : path.includes(v.path)))?.component || NotFound;

  try {
    $app.replaceChildren(await component());
  } catch (e) {
    console.error(e);
    $app.replaceChildren(await ErrorMesasge(e));
  }
};

const historyPush = async (path) => {
  path = await homepageFetcher.changePath(path);
  history.pushState({}, "", path);
  await render(path);
};

//뒤로 가기, 앞으로 가기 렌더링
window.addEventListener("popstate", async () => await render(window.location.pathname));

//초기 렌더링
window.addEventListener("DOMContentLoaded", async () => {
  await homepageFetcher.read();
  await render(window.location.pathname);
});

export { historyPush };
