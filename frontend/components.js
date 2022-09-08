//컴포넌트 내부에서 데이터를 받아온다.
import { book } from "./index.js";
import { historyPush } from "./router.js";
import { getJSON } from "./index.js";

const BookDetail = () => {
  const queryString = location.search;
  const params = new URLSearchParams(queryString);
  const name = params.get("name");

  return Book(book);
};

const BookList = () => {
  const $temp = document.createElement("div");
  $temp.className = "main";
  (async () => {
    try {
      const response = await getJSON("./book-data.json");
      $temp.append(...response.data.map(({ image, name }) => Book({ image, name })));
    } catch (e) {
      $temp.innerHTML = e;
    }
  })();

  return $temp;
};

const Book = ({ image, name }) => {
  const content = `<div class="book">
  <div><h2>${name}</h2></div>
    <div><image src=${image} alt=${name} width=180/></div>
  </div>
  `;
  const $element = createElement(content);
  $element.addEventListener("click", () => {
    historyPush(`/detail?name=${name}`);
  });
  return $element;
};

const NotFound = () => {
  const content = `Not Found 404`;
  return createElement(content);
};

const createElement = (content) => {
  const $temp = document.createElement("div");
  $temp.innerHTML = content;
  return $temp;
};

export { Book, BookList, BookDetail, NotFound };
