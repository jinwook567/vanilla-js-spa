import { BookList, BookDetail, NotFound, Error } from "./components.js";
import { $app } from "./utils.js";
import { fetchData } from "./utils.js";

const routes = [
  { path: "/", component: BookList, exact: true },
  { path: "/detail", component: BookDetail, exact: false },
];

// TODO: BaseUrl을 package.json에 넣어놓고, 빌드 과정에서 ./data/baseUrl.json 을 생성한다. 그리고 해당 경로에 baseUrl을 저장한다. 불필요한 하위 경로를 제외시켜준다.
const fetchBaseUrl = async (path) => {
  try {
    const baseUrl = await fetchData("./data/baseUrl.json");
    const subPath = baseUrl.slice(window.location.origin.length, baseUrl.length);
    return path.replace(subPath, "");
  } catch (e) {
    return path;
  }
};

const render = async (path) => {
  //배포를 위한 임시 처리, line 10 TODO 완성해야함.
  path = path.replace("/vanilla-js-spa", "");

  const component =
    routes.find((v) => (v.exact ? v.path === path : path.includes(v.path)))?.component || NotFound;

  try {
    $app.replaceChildren(await component());
  } catch (e) {
    console.error(e);
    $app.replaceChildren(Error(e));
  }
};

const historyPush = (path) => {
  history.pushState({}, "", path);
  render(path);
};

//뒤로 가기, 앞으로 가기 렌더링
window.addEventListener("popstate", () => render(window.location.pathname));

//초기 렌더링
window.addEventListener("DOMContentLoaded", async () => {
  console.log(window.location.origin);
  render(window.location.pathname);
});

export { historyPush };
