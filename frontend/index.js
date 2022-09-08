class SampleBook {
  constructor() {
    this.image = "https://image.yes24.com/goods/105655620/XL";
    this.name = "월가를 위한 퀀트투자 바이블";
  }
}

const book = new SampleBook();
const $app = document.getElementById("app");

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

export { $app, book, getJSON };
