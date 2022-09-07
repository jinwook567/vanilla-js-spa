const BookList = (bookData) => {
  const content = `
    <div>${bookData.map(({ image, name }) => Book({ image, name }).innerHTML)}</div>
  `;
  return createElement(content);
};

const Book = ({ image, name }) => {
  const content = `<div>
  <div><h2>${name}</h2></div>
    <div><image src=${image} alt=${name} width=180/></div>
  </div>
  `;
  const $element = createElement(content);
  $element.addEventListener("click", () => {
    history.pushState({}, null, `/detail?name=${name}`);
  });
  return $element;
};

const createElement = (content) => {
  const $temp = document.createElement("div");
  $temp.innerHTML = content;
  return $temp;
};

export { Book, BookList };
