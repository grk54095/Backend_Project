import { Controller, Dependencies, Get, Bind, Query, Param, Post, Body, } from '@nestjs/common';

@Controller('library')
export class AppController {
  #acervo;
  constructor() {
    this.#acervo = []
    this.#acervo[0] = { title: "JavaScrip Introduction", author: "Will" };
    this.#acervo[1] = { title: "AI domanince", author: "Bryan" };
    this.#acervo[2] = { title: "English History", author: "Willson" };
    this.#acervo[3] = { title: "World Economy", author: "Willson" };
    this.#acervo[4] = { title: "America in one word", author: "Weber" };
    this.#acervo[5] = { title: "JavaScript developers", author: "Will" };


  }
  @Get()
  getHello() {
    return 'Hello World, thats our new library!';
  }
  @Get('books')
  getBookList() {
    return this.#acervo;
  }

  @Get('author')
  getBookAuthor() {
    return [...new Set(this.#acervo.map(name => name.author))];

  }

  @Get('title')
  getBookTitle() {
    return this.#acervo.map(workName => workName.title)
  }

  @Get('authorbook')
  @Bind(Query())
  getauthorbook(query) {
    console.log(query.author);
    var resp = [];
    for (const book of this.#acervo.values()) {
      if (book.author === query.author) {
        resp.push(book.title)
      }
    }
    return resp;
  }

  @Get('book/title/:title')
  @Bind(Param())
  getbookTitle(param) {
    var resp = [];
    for (const book of this.#acervo.values()) {
      if (book.title === param.title) {
        resp.push(book);
      }
    }
    return resp;
  }

  @Post("teste")
  @Bind(Body())
  postTest(dados) {
    console.log(dados.name)
    return dados.name;
  }

}
