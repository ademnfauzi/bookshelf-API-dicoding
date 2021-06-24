const {
  tambahBukuHandler,
  semuaBukuHandler,
  bukuBerdasarkanIdHandler,
  editBukuHandler,
  hapusBukuHandler,
} = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: tambahBukuHandler,
  },
  {
    method: 'GET',
    path: '/books',
    handler: semuaBukuHandler,
  },
  {
    method: 'GET',
    path: '/books/{id}',
    handler: bukuBerdasarkanIdHandler,
  },
  {
    method: 'PUT',
    path: '/books/{id}',
    handler: editBukuHandler,
  },
  {
    method: 'DELETE',
    path: '/books/{id}',
    handler: hapusBukuHandler,
  },
];

module.exports = routes;
