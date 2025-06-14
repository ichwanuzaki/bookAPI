const Hapi = require('@hapi/hapi');
const booksRoutes = require('./routes/booksRoutes');

const init = async () => {
  const server = Hapi.server({ port: 9000, host: 'localhost' });

  server.route(booksRoutes);

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

init();