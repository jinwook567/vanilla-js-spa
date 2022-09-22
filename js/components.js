import { historyPush } from "./router.js";
import { fetchData } from "./utils.js";

//클로저를 활용해서 api fetch를 한번만 수행하도록 함. (전역 변수 사용 억제)
const fetchBooks = () => {
  let books = [];
  let status = "idle";

  return async function () {
    if (status === "success") return books;

    try {
      books = await fetchData("./data/book-data.json");
      status = "success";
      return books;
    } catch (e) {
      throw "책 정보를 불러오는데 실패하였습니다.";
    }
  };
};

const getBooks = fetchBooks();

const BookDetail = async () => {
  const queryString = location.search;
  const params = new URLSearchParams(queryString);
  const id = params.get("id");

  const books = await getBooks();
  const book = books.find((el) => el.id === Number(id));

  return Book(book);
};

const BookList = async () => {
  const $temp = document.createElement("div");
  $temp.className = "list";

  const books = await getBooks();

  $temp.append(...books.map(({ coverImage, name, id }) => Book({ coverImage, name, id })));
  return $temp;
};

const Book = ({ coverImage, name, html, id }) => {
  const content = `<div>
  <div class="card">
    <h2>${name}</h2>
    <img src=${coverImage} alt=${name} width=180/>
  </div>
    <div class="body">
      ${html ? html : ""}
    </div>
  </div>
  `;

  const $element = createElement(content);
  const $card = $element.querySelector(".card");

  $card.addEventListener("click", () => {
    historyPush(`/detail?id=${id}`);
  });
  return $element;
};

const NotFound = () => {
  const content = `Not Found 404`;
  return createElement(content);
};

const Error = (message) => {
  return createElement(`에러, ${message}`);
};

const createElement = (content) => {
  const $temp = document.createElement("div");
  $temp.innerHTML = content;
  return $temp;
};

export { Book, BookList, BookDetail, NotFound, Error };
