const { nanoid } = require('nanoid');
const books = require('./books');

const tambahBukuHandler = (request, h) => {
  //   mengambil data dari body json
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  //   cek apakah nama nya kosong atau tidak
  if (!name || name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }
  // cek apakah readPage lebih besar dari pageCount
  if (pageCount < readPage) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
    return response;
  }
  const tanggal = new Date().toISOString();
  //   libarary nanoId untuk membuat id secara acak
  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = tanggal;
  const updatedAt = tanggal;
  const tambahBukuBaru = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  //   menambahkan data buku kedalam array yg ada pada halaman books
  books.push(tambahBukuBaru);

  const sukses = books.filter((book) => book.id === id).length > 0;

  //   cek apakah berhasil ditambahkan
  if (sukses) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    }).code(201);

    return response;
  }
  // jika gagal ditambahkan
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  }).code(500);

  return response;
};

const semuaBukuHandler = (request, h) => {
  let saringBuku = books;
  // mengambil nilai query dari url
  const { name, reading, finished } = request.query;

  //   jika name bernilai true
  if (name) {
    saringBuku = saringBuku.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
  }

  //   jika reading bernilai true
  if (reading) {
    saringBuku = saringBuku.filter(
      (book) => book.reading === !!Number(reading),
    );
  }
  //   jika finished bernilai true
  if (finished) {
    saringBuku = saringBuku.filter(
      (book) => book.finished === !!Number(finished),
    );
  }

  const response = h.response({
    status: 'success',
    data: {
      books: saringBuku.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  }).code(200);
  return response;
};

const bukuBerdasarkanIdHandler = (request, h) => {
  // mendapatkan id dari url
  const { id } = request.params;
  const book = books.filter((n) => n.id === id)[0];

  //   jika nilai buku true
  if (book) {
    const response = h.response({
      status: 'success',
      data: {
        book,
      },
    }).code(200);
    return response;
  }
  // jika id buku tidak ditemukan
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  }).code(404);
  return response;
};

const editBukuHandler = (request, h) => {
  const tanggal = new Date().toISOString();
  // mendapatkan id dari url
  const { id } = request.params;
  //   mengambil data dari body json
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  // mencari id buku dan mensamakan dengan id yg ada pada file book
  const index_buku = books.findIndex((book) => book.id === id);
  // jika index yg telah berisi data - data buku tidak bernilai -1
  if (index_buku !== -1) {
    //   jika nama bernilai false
    if (!name || name === undefined) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      }).code(400);
      return response;
    }
    // jika pagecount lebih kecil dari readpage
    if (readPage > pageCount) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      }).code(400);
      return response;
    }
    const updatedAt = tanggal;
    const finished = (pageCount === readPage);
    // menggambungkan data - data
    books[index_buku] = {
      ...books[index_buku],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    }).code(200);
    return response;
  }
  // jika id pada buku tidak ditemukan
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  }).code(404);
  return response;
};

const hapusBukuHandler = (request, h) => {
  //   mendapatkan id dari url
  const { id } = request.params;
  // mensamakan id dengan id yg ada pada file book
  const index_buku = books.findIndex((note) => note.id === id);
  // jika index tidak bernilai -1
  if (index_buku !== -1) {
    //   menghapus data buku
    books.splice(index_buku, 1);
    const response = h
      .response({
        status: 'success',
        message: 'Buku berhasil dihapus',
      })
      .code(200);

    return response;
  }
  // jika id tidak ditemukan
  const response = h
    .response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    })
    .code(404);

  return response;
};

module.exports = {
  tambahBukuHandler,
  semuaBukuHandler,
  bukuBerdasarkanIdHandler,
  editBukuHandler,
  hapusBukuHandler,
};
