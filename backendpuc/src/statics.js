import { Injectable } from '@nestjs/common';

@Injectable()
@Dependencies(Acervo)
export class Statics {
    #acervo;

    constructor(acervo) {
        this.#acervo = acervo
    }

    authorWorks(author) {
        validate(author, "string");
        let first = this.#acervo.getAuthors(author);
        return first.lenght;
    }

    recentWorks(year) {
        validate(year, 'number');
        let first = this.#acervo.getBooksList();
        let cont = 0
        for (const book of first) {
            if (book.year > year) {
                cont++;
            }
        }
        return cont;
    }

    numberPublicationYearAuthor(author, year) {
        validate(arguments, ["String", "Number"]);
        let first = this.#acervo.getBooksList();
        let cont = 0;
        for (const book of first) {
            if (book.author == author && book.year == year) {
                cont++;
            }
        }
        return cont;
    }
}