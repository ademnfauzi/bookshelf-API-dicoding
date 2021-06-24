const { nanoid } = require('nanoid');
const books = require('./books');

const tambahBukuHandler = (h, request) => {
  const tanggal = new Date().toISOString();
  //   libarary nanoId untuk membuat id secara acak
  const id = nanoid(16);
  //   mengambil data dari body json
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  //   cek apakah nama nya kosong atau tidak
  if (!name) {
    const respon_server = h.response({
      status: 'fail',
      message: 'Gagal Tambah Buku. Silahkan Mengisi Nama Buku Tersebut',
    }).code(400);
    return respon_server;
  }
  // cek apakah readPage lebih besar dari pageCount
  if (pageCount < readPage) {
    const respon_server = h.response({
      status: 'fail',
      message: 'Read Page tidak boleh lebih besar dari Read Page',
    }).code(400);
    return respon_server;
  }
  const finished = (pageCount === readPage);
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

  const sukses = books.filter((buku) => buku.id === id).length > 0;

  //   cek apakah berhasil ditambahkan
  if (sukses) {
    const respon_server = h.response({
      status: 'success',
      message: 'Selamat buku Anda berhasil ditambahkan',
      data: {
        bookId: id,
      },
    }).code(201);

    return respon_server;
  }
  // jika gagal ditambahkan
  const respon_server = h.response({
    status: 'fail',
    message: 'Buku Anda gagal ditambahkan',
  }).code(500);

  return respon_server;
};

const semuaBukuHandler = (request, h) => {
  let saringBuku = books;
  // mengambil nilai query dari url
  const { name, reading, finished } = request.query;

  //   jika name bernilai true
  if (name) {
    saringBuku = saringBuku.filter((buku) => buku
      .name.toLowerCase().includes(name.toLowerCase()));
  }
  //   jika reading bernilai true
  if (reading) {
    saringBuku = saringBuku.filter((buku) => buku.reading === !!Number(reading));
  }
  //   jika finished bernilai true
  if (finished) {
    saringBuku = saringBuku.filter((buku) => buku.finished === !!Number(finished));
  }

  const respon_server = h.response({
    status: 'success',
    data: {
      books: saringBuku.map((buku) => ({
        id: buku.id,
        name: buku.name,
        publisher: buku.publisher,
      })),
    },
  }).code(200);
  return respon_server;
};

const bukuBerdasarkanIdHandler = (h, request) => {
  // mendapatkan id dari url
  const { id } = request.params;
  const buku = books.filter((n) => n.id === id)[0];

  //   jika nilai buku true
  if (buku) {
    const respon_server = h
      .response({
        status: 'success',
        data: {
          buku,
        },
      }).code(200);
    return respon_server;
  }
  // jika id buku tidak ditemukan
  const respon_server = h.response({
    status: 'fail',
    message: 'Id buku Anda tidak dapat ditemukan',
  }).code(404);
  return respon_server;
};

const editBukuHandler = (h, request) => {
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
  const index_buku = books.findIndex((buku) => buku.id === id);
  // jika index yg telah berisi data - data buku tidak bernilai -1
  if (index_buku !== -1) {
    //   jika nama bernilai false
    if (!name) {
      const respon_server = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Dimohon isi nama buku yang baru',
      }).code(400);
      return respon_server;
    }
    // jika pagecount lebih kecil dari readpage
    if (pageCount < readPage) {
      const respon_server = h.response({
        status: 'fail',
        message: 'Read Page tidak boleh lebih kecil dari Read Page',
      }).code(400);
      return respon_server;
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

    const respon_server = h.response({
      status: 'success',
      message: 'Buku Anda berhasil diperbarui',
    }).code(200);
    return respon_server;
  }
  // jika id pada buku tidak ditemukan
  const respon_server = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id buku Anda tidak dapat ditemukan',
  }).code(404);
  return respon_server;
};

const hapusBukuHandler = (h, request) => {
//   mendapatkan id dari url
  const { id } = request.params;
  // mensamakan id dengan id yg ada pada file book
  const index_buku = books.findIndex((buku) => buku.id === id);
  // jika index tidak bernilai -1
  if (index_buku !== -1) {
    //   menghapus data buku
    books.splice(index_buku, 1);
    const respon_server = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    }).code(200);

    return respon_server;
  }
  // jika id tidak ditemukan
  const respon_server = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id buku Anda tidak dapat ditemukan',
  }).code(404);

  return respon_server;
};

module.exports = {
  tambahBukuHandler,
  semuaBukuHandler,
  bukuBerdasarkanIdHandler,
  editBukuHandler,
  hapusBukuHandler,
};
