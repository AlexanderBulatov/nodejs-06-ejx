const router = require('express').Router();
const fs = require('fs');
const path = require('path');
const { booksStor, Book } = require('../database/db');

// const api = require('../utils/apiFront');

const fileMulter = require('../middleware/uploadBook');

router.get('/', (req, res) => {
  res.render('index', {
    title: 'Главная',
  });
});

router.post('/api/user/login', (req, res) => {
  res.status(201).json({ id: 1, mail: 'test@mail.ru' });
});
// ------- общий список
router.get('/books', (req, res) => {
  const { books } = booksStor;
  // res.json(books);
  res.render('book/index', {
    title: 'Books',
    books,
  });
});
// отдать файл выбранной книги
router.get('/books/:id/download', (req, res) => {
  const { id } = req.params;
  const { books } = booksStor;
  const idx = books.findIndex((el) => el.id === id);

  if (idx !== -1) {
    fs.readdir(path.join(__dirname, '../public'), (err, filenames) => {
      if (err) {
        res.statusCode(500).send({ message: `Server error: ${err}` });
        return null;
      }
      const downloadFile = filenames.find((filename) => filename.includes(req.params.id, 0));
      // return res.download(path.join(__dirname, '../public', downloadFile),
      // downloadFile.replace(`${req.params.id} _id_ `, ''), (e) => {
      return res.download(path.join(__dirname, '../public', downloadFile), books[idx].fileBook, (e) => {
        if (err) return res.statusCode(500).json({ message: `Downloading error: ${e}` });
        return null;
      });
    });
  } else {
    res.status(404);
    res.json('404 | страница не найдена');
  }
});
// показать выбранную книгу
router.get('/books/show/:id', (req, res) => {
  const { books } = booksStor;
  const { id } = req.params;
  const idx = books.findIndex((el) => el.id === id);
  if (idx !== -1) {
    res.render('book/view', {
      book: books[idx],
    });
    //  res.json(books[idx]);
  } else {
    res.status(404);
    res.json('404 | страница не найдена');
  }
});
// загрузить страницу редактирования книги
router.get('/books/update/:id', (req, res) => {
  const { books } = booksStor;
  const { id } = req.params;
  const idx = books.findIndex((el) => el.id === id);

  if (idx !== -1) {
    res.render('book/update', {
      book: books[idx],
    });
    // res.json(books[idx]);
  } else {
    res.status(404);
    res.json('404 | страница не найдена');
  }
});
// отправить обновленные данные книги и вернуться на просмотр инфо о книге
router.post('/books/update/:id', fileMulter.single('uploaded_file'), (req, res) => {
  const { books } = booksStor;
  const {
    title, description, authors, favorite, fileCover, fileName,
  } = req.body;
  const { id } = req.params;
  const idx = books.findIndex((el) => el.id === id);

  if (idx !== -1) {
    books[idx] = {
      ...books[idx],
      title,
      description,
      authors,
      favorite,
      fileCover,
      fileName,
    };
    if (req.file) {
      if (req.body.fileBook) {
        books[idx].fileBook = req.body.fileBook;
        req.serverFileName = `${books[idx].id} _id_ ${req.body.fileBook + path.extname(req.file.filename)}`;
      } else {
        books[idx].fileBook = req.initialFileName;
        req.serverFileName = `${books[idx].id} _id_ ${req.initialFileName}`;
      }
      fs.rename(
        path.join(__dirname, '../public', req.file.filename),
        path.join(__dirname, '../public', req.serverFileName),
        (err) => {
          if (err) {
            return res.status(500).json({ message: `Server error ${err}` });
          }
          books[idx].fileName = req.serverFileName;
          return null;
          // return res.redirect(`/books/${id}`);
          // res.status(201).json({ message: 'File uploaded', book: updatedBook });
        },
      );
    } else {
      console.log('No attachment');
    }
    return res.redirect(`/books/show/${id}`);

    // res.json(books[idx]);
  }
  res.status(404);
  return res.json('404 | страница не найдена');
});

router.get('/books/create', (req, res) => {
  res.render('book/create', {
    books: booksStor,
  });
});

router.post('/books/create', fileMulter.single('uploaded_file'), (req, res) => {
  const { books } = booksStor;
  const {
    title, description, authors, favorite,
  } = req.body;
  const newBook = new Book(
    title,
    description,
    authors,
    favorite,
    '',
    '',
  );
  if (req.file) {
    if (req.body.fileBook) {
      newBook.fileBook = req.body.fileBook;
      req.serverFileName = `${newBook.id} _id_ ${req.body.fileBook + path.extname(req.file.filename)}`;
    } else {
      newBook.fileBook = req.initialFileName;
      req.serverFileName = `${newBook.id} _id_ ${req.initialFileName}`;
    }
    fs.rename(
      path.join(__dirname, '../public', req.file.filename),
      path.join(__dirname, '../public', req.serverFileName),
      (err) => {
        if (err) {
          return res.status(500).json({ message: `Server error ${err}` });
        }
        newBook.fileName = req.serverFileName;
        books.push(newBook);
        return res.redirect(`/books/show/${newBook.id}`);
        // return res.redirect(`/books/${id}`);
        // res.status(201).json({ message: 'File uploaded', book: updatedBook });
      },
    );
  } else {
    console.log('No attachment');
    books.push(newBook);
    return res.redirect(`/books/show/${newBook.id}`);
  }
  return null;
});

router.post(
  '/api/books',
  fileMulter.single('book'),
  (req, res) => {
    if (!req.file) {
      return res.send({ message: 'Ошибка загрузки файла' });
    }
    const { books } = booksStor;

    const {
      title, description, authors, favorite, fileCover,
    } = req.body;
    const newBook = new Book(
      title,
      description,
      authors,
      favorite,
      fileCover,
      req.serverFileName,
      req.initialFileName,
    );

    if (req.body.fileBook) {
      newBook.fileBook = req.body.fileBook;
      req.serverFileName = `${newBook.id} _id_ ${req.body.fileBook + path.extname(req.file.filename)}`;
    } else {
      newBook.fileBook = req.initialFileName;
      req.serverFileName = `${newBook.id} _id_ ${req.initialFileName}`;
    }

    fs.rename(
      path.join(__dirname, '../public', req.file.filename),
      path.join(__dirname, '../public', req.serverFileName),
      (err) => {
        if (err) {
          return res.status(500).json({ message: `Server error ${err}` });
        }
        newBook.fileName = req.serverFileName;
        books.push(newBook);
        return res.status(201).json({ message: 'File uploaded', book: newBook });
      },
    );
    return null;
  },
);

router.post('/books/delete/:id', (req, res) => {
  const { books } = booksStor;
  const { id } = req.params;
  const idx = books.findIndex((el) => el.id === id);
  if (idx !== -1) {
    if (books[idx].fileName !== '') {
      fs.unlink(
        path.join(__dirname, '../public', books[idx].fileName),
        (err) => {
          if (err) {
            throw err;
          }
          console.log('Delete File successfully!');
        },
      );
    }
    books.splice(idx, 1);
    res.redirect('/books');
    // res.json('okey');
  } else {
    res.status(404);
    res.json('404 | страница не найдена');
  }
});

router.post('/books/file/delete/:id', (req, res) => {
  const { books } = booksStor;
  const { id } = req.params;
  const idx = books.findIndex((el) => el.id === id);
  if (idx !== -1 && books[idx].fileName !== '') {
    fs.unlink(
      path.join(__dirname, '../public', books[idx].fileName),
      (err) => {
        if (err) {
          throw err;
        }
        console.log('Delete File successfully!');
        books[idx].fileName = '';
        books[idx].fileBook = '';
        res.redirect(`/books/update/${id}`);
      },
    );
  } else {
    res.status(404);
    res.json('404 | страница не найдена');
  }

  // res.json('okey');
});

module.exports = router;
