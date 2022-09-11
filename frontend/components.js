import { historyPush } from "./router.js";
import { getJSON } from "./index.js";
import { convertMdToHTML } from "./index.js";

const fetchBooks = () => {
  let books = [];
  let status = "idle";

  return async function () {
    if (status === "success") return { books, status };

    try {
      const response = await getJSON("./book-data.json");
      books = response.data;
      status = "success";
    } catch (e) {
      status = "failed";
    } finally {
      return { books, status };
    }
  };
};

const getBooks = fetchBooks();

const BookDetail = async () => {
  const queryString = location.search;
  const params = new URLSearchParams(queryString);
  const id = params.get("id");

  const { books, status } = await getBooks();
  if (status === "failed") return Error("fetch error");

  const book = books.find((el) => el.id === Number(id));
  return Book(book);
};

const BookList = async () => {
  const $temp = document.createElement("div");
  $temp.className = "main";

  const { books, status } = await getBooks();
  if (status === "failed") return Error("fetch error");

  $temp.append(...books.map(({ image, name, id }) => Book({ image, name, id })));
  return $temp;
};

const Book = ({ image, name, text, id }) => {
  const html = convertMdToHTML(text);

  const content = `<div class="book">
  <div><h2>${name}</h2></div>
    <div><image src=${image} alt=${name} width=180/></div>
  </div>
  ${text ? html : ""}
  `;
  const $element = createElement(content);

  $element.addEventListener("click", () => {
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

export { Book, BookList, BookDetail, NotFound };
