import { Controller, Dependencies, Get, Bind, Query, Param, Post, Body, } from '@nestjs/common';
import { Acervo } from "./app.service";
import { Statics } from "./statics";

@Controller('library')
@Dependencies(Acervo, Statics)
export class AppController {
  #acervo;
  #statics;
  constructor(acervo, statics) {
    this.#acervo = acervo;
    this.#statics = statics;
  }
  @Get()
  getHello() {
    return 'Hello World, thats our new library!';
  }
  @Get('books')
  getBook() {
    return this.#acervo.getBooksList();
  }

  @Get('author')
  getAuthor() {
    return Array.from(this.#acervo.getAuthors());

  }

  @Get('title')
  getTitle() {
    return this.#acervo.getTitles()
  }

  @Get('authorbook')
  @Bind(Query())
  getauthorbook(query) {

    return this.#acervo.getBooksAuthor(query.author);
  }

  @Get('book/title/:title')
  @Bind(Param())
  getbookTitle(param) {
    return this.#acervo.getBooksTitle(param.title);
  }

  @Get('numberofTitles/author/:author')
  @Bind(Param())
  getnumberoftitles(params) {
    return this.#statics.authorWorks(params.author);
  }

  @Get('mostRecentWork/year/:year')
  @Bind(Param())
  getnumberofmostrecentwork(params) {
    return this.#statics.recentWorks(params.author);
  }

  @Get('numberofWorks/author/:author/year/:year')
  @Bind(Param())
  getNumberofWorksFromAuthor(params) {
    return this.#statics.numberPublicationYearAuthor(params.author, params.year);
  }

  @Post("teste")
  @Bind(Body())
  postTest(dados) {
    console.log(dados.name)
    return dados.name;
  }

}
