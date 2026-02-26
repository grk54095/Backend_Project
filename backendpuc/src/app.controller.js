import { Controller, Dependencies, Get } from '@nestjs/common';

@Controller('library')
export class AppController {
  @Get()
  getHello() {
    return 'Hello World, thats our new library!';
  }
  @Get('books')
  getBookList() {
    return 'Book List';
  }
}
