class Book {
  constructor({ name, image }) {
    this.$target = document.createElement("div");
    this.render(name, image);
  }

  render(name, image) {
    this.$target.innerHTML = `<div>
    <div>
        <h2>${name}</h2>
    </div>
    <div>
        <image src=${image} alt=${name} width="200px"/>
    </div>
    </div>`;
  }
}

export default Book;
