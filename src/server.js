const Hapi = require('@hapi/hapi');
const routes = require('./routes');

const init_server = async () => {
  const serv = Hapi.server({
    port: 3000,
    host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
    routes: {
      // menambahkan sistem cors
      cors: {
        origin: ['*'],
      },
    },
  });

  // mengambil data dari file routes
  serv.route(routes);

  await serv.start();
  console.log(`Server sedang berjalan di ${serv.info.uri} , Silahkan Anda akses`);
};

init_server();
