import { Injectable } from '@nestjs/common';

@Injectable()
export class Acervo {
  #acervo;

  constructor() {
    this.#acervo = []
    this.#acervo[0] = { title: "JavaScrip Introduction", author: "Will", year: 2020 };
    this.#acervo[1] = { title: "AI domanince", author: "Bryan", year: 2015 };
    this.#acervo[2] = { title: "English History", author: "Willson", year: 2023 };
    this.#acervo[3] = { title: "World Economy", author: "Willson", year: 2022 };
    this.#acervo[4] = { title: "America in one word", author: "Weber", year: 2020 };
    this.#acervo[5] = { title: "JavaScript developers", author: "Will", year: 2022 };
  }

  getBooksList() {
    return this.#acervo;
  }

  getTitles() {
    return this.#acervo.map(workname => workname.title);
  }

  getAuthors() {
    return [...Set(this.#acervo.map(name => name.author))]
  }

  getBooksAuthor(author) {
    var resp = [];
    for (const book of this.#acervo.values()) {
      if (book.author === author) {
        resp.push(book.title);
      }
    }
    return resp;
  }

  getBooksTitle(title) {
    var resp = [];
    for (const book of this.#acervo.values()) {
      if (book.title == title) {
        resp.push(book);
      }
    }
    return resp;
  }
}

