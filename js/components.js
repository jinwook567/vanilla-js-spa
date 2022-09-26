import { historyPush } from "./router.js";
import { asyncFetch } from "./utils.js";

//클로저를 활용해서 api fetch를 한번만 수행하도록 함. (전역 변수 사용 억제)
const createBookFetcher = () => {
  let books = [];
  let isExcuted = false;

  return {
    async read() {
      if (isExcuted) return books;
      books = await asyncFetch("./data/book-data.json");
      isExcuted = true;
      return books;
    },
  };
};

const bookFetcher = createBookFetcher();

const BookDetail = async () => {
  const queryString = location.search;
  const params = new URLSearchParams(queryString);
  const id = params.get("id");

  const books = await bookFetcher.read();
  const book = books.find((el) => el.id === Number(id));

  return await Book(book);
};

const BookList = async () => {
  const $temp = document.createElement("div");
  $temp.className = "list";

  const books = await bookFetcher.read();
  const bookComponents = await Promise.all(
    books.map(async ({ coverImage, name, id }) => await Book({ coverImage, name, id }))
  );

  $temp.append(...bookComponents);
  return $temp;
};

const Book = async ({ coverImage, name, html, id }) => {
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

  $card.addEventListener("click", async () => {
    await historyPush(`/detail?id=${id}`);
  });
  return $element;
};

const NotFound = async () => {
  const content = `Not Found 404`;
  return createElement(content);
};

const ErrorMesasge = async (message) => {
  return createElement(`에러, ${message}`);
};

const createElement = (content) => {
  const $temp = document.createElement("div");
  $temp.innerHTML = content;
  return $temp;
};

export { Book, BookList, BookDetail, NotFound, ErrorMesasge };
