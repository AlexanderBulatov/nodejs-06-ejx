const { v4: uuid } = require('uuid');

class Book {
  constructor(
    title = '',
    description = '',
    authors = '',
    favorite = '',
    fileCover = '',
    fileName = '',
    fileBook = '',
    id = uuid(),
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.authors = authors;
    this.favorite = favorite;
    this.fileCover = fileCover;
    this.fileName = fileName;
    this.fileBook = fileBook;
  }
}

const booksStor = {
  books: [
    new Book(
      'Слово о словах',
      'Книга о словах, их смысле и жизни',
      'Лев Успенский',
      'очень',
      '',
      '',
      '',
    ),
    new Book(
      'Что делать',
      'Обо все сразу',
      'Чернышевский',
      'нет',
      '',
      '',
      '',
    ),
    new Book(
      'Письма начинающему художнику',
      'Книга ученика Кардовского для начинающих художников',
      'М. Храпковский',
      'весьма',
      '',
      '',
      '',
    ),
  ],
};

module.exports = {
  Book,
  booksStor,
};
