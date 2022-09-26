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
        homepage = await asyncFetch("./data/homepage.json");
      } catch (e) {
        //homepage.json이 없는 경우.
      } finally {
        isExcuted = true;
        return homepage;
      }
    },

    isProduction() {
      return !homepage.test(/http\:\/\/localhost:/gi);
    },

    async changePath() {
      await this.read();
    },
  };
}

const homepageFetcher = createHomePageFetcher();

const render = async (path) => {
  //배포를 위한 임시 처리, line 10 TODO 완성해야함.
  path = path.replace("/vanilla-js-spa", "");

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
