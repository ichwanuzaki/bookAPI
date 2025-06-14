const { nanoid } = require('nanoid');
const books = require('../data/books');

const addBook = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

  if (!name) {
    return h.response({ status: 'fail', message: 'Gagal menambahkan buku. Mohon isi nama buku' }).code(400);
  }

  if (readPage > pageCount) {
    return h.response({ status: 'fail', message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount' }).code(400);
  }

  const id = nanoid();
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;

  const newBook = { id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt };
  books.push(newBook);

  return h.response({ status: 'success', message: 'Buku berhasil ditambahkan', data: { bookId: id } }).code(201);
};

const getAllBooks = (request, h) => {
  let filteredBooks = [...books];

  if (request.query.name) {
    const nameQuery = request.query.name.toLowerCase();
    filteredBooks = filteredBooks.filter((book) => book.name.toLowerCase().includes(nameQuery));
  }

  if (request.query.reading !== undefined) {
    const isReading = request.query.reading === '1';
    filteredBooks = filteredBooks.filter((book) => book.reading === isReading);
  }

  if (request.query.finished !== undefined) {
    const isFinished = request.query.finished === '1';
    filteredBooks = filteredBooks.filter((book) => book.finished === isFinished);
  }

  const simplifiedBooks = filteredBooks.map((book) => ({ id: book.id, name: book.name, publisher: book.publisher }));
  return h.response({ status: 'success', data: { books: simplifiedBooks } });
};

const getBookById = (request, h) => {
  const { bookId } = request.params;
  const book = books.find((b) => b.id === bookId);

  if (!book) {
    return h.response({ status: 'fail', message: 'Buku tidak ditemukan' }).code(404);
  }

  return h.response({ status: 'success', data: { book } });
};

const updateBook = (request, h) => {
  const { bookId } = request.params;
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

  const bookIndex = books.findIndex((b) => b.id === bookId);

  if (bookIndex === -1) {
    return h.response({ status: 'fail', message: 'Gagal memperbarui buku. Id tidak ditemukan' }).code(404);
  }

  if (!name) {
    return h.response({ status: 'fail', message: 'Gagal memperbarui buku. Mohon isi nama buku' }).code(400);
  }

  if (readPage > pageCount) {
    return h.response({ status: 'fail', message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount' }).code(400);
  }

  const updatedAt = new Date().toISOString();
  const finished = pageCount === readPage;

  books[bookIndex] = { ...books[bookIndex], name, year, author, summary, publisher, pageCount, readPage, reading, finished, updatedAt };
  return h.response({ status: 'success', message: 'Buku berhasil diperbarui' });
};

const deleteBook = (request, h) => {
  const { bookId } = request.params;
  const bookIndex = books.findIndex((b) => b.id === bookId);

  if (bookIndex === -1) {
    return h.response({ status: 'fail', message: 'Buku gagal dihapus. Id tidak ditemukan' }).code(404);
  }

  books.splice(bookIndex, 1);
  return h.response({ status: 'success', message: 'Buku berhasil dihapus' });
};

module.exports = { addBook, getAllBooks, getBookById, updateBook, deleteBook };