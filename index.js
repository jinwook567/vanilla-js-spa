const $app = document.getElementById("app");
const showdown = window.showdown;
const converter = new showdown.Converter();

const convertMdToHTML = (md) => {
  return converter.makeHtml(md);
};

const getJSON = (path) =>
  new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open("GET", path);
    request.responseType = "json";
    request.send();
    request.onload = () => {
      if (request.status === 200 && request.response) resolve(request.response);
      else reject("fetch failed");
    };
  });

export { $app, getJSON, convertMdToHTML };
