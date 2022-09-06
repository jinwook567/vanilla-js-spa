const routes = [
  { path: "/", component: "<div>main</div>", exact: true },
  { path: "/detail", component: "<div>book data</div>", exact: false },
];

const $app = document.getElementById("app");

const render = (path) => {
  const component =
    routes.find((v) => (v.exact ? v.path === path : v.path.includes(path)))?.component ||
    "<div>Not Found</div>";

  $app.replaceChildren(component);
};

window.addEventListener("DOMContentLoaded", () => render(window.location.pathname));
