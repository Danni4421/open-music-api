require('dotenv').config();

// import
const Hapi = require('@hapi/hapi');
const OpenMusic = require('./api');
const OpenMusicService = require('./service/postgres/OpenMusic');
const OpenMusicValidator = require('./validator/OpenMusic/OpenMusicValidator');

// custom error handling
const ClientError = require('./exceptions/client/ClientError');
const NotFoundError = require('./exceptions/client/NotFoundError');
const InternalServerError = require('./exceptions/server/InternalServerError');
const ServiceUnavailableError = require('./exceptions/server/ServiceUnavailableError');

// init Hapi
const init = async () => {
  const openMusicService = new OpenMusicService();

  const server = Hapi.server({
    host: process.env.HOST,
    port: process.env.PORT,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register({
    plugin: OpenMusic,
    options: {
      service: openMusicService,
      validator: OpenMusicValidator,
    },
  });

  // onPreResponse
  server.ext('onPreResponse', (req, res) => {
    const { response } = req;

    if (response instanceof Error) {
      // client error
      if (response instanceof ClientError) {
        const clientErrorResponse = res.response({
          status: 'fail',
          message: response.message,
        });
        clientErrorResponse.code(response.statusCode);
        return clientErrorResponse;
      }

      if (response instanceof NotFoundError) {
        const notFoundError = res.response({
          status: 'fail',
          message: response.message,
        });
        notFoundError.code(response.statusCode);
        return notFoundError;
      }

      if (!response.isServer) {
        return res.continue;
      }

      // server error
      if (response instanceof InternalServerError) {
        const internalServerError = res.response({
          status: 'fail',
          message: response.message,
        });
        internalServerError.code(response.statusCode);
        return internalServerError;
      }

      if (response instanceof ServiceUnavailableError) {
        const serviceUnavailableError = res.response({
          status: 'fail',
          message: response.message,
        });
        serviceUnavailableError.code(response.statusCode);
        return serviceUnavailableError;
      }
    }

    return res.continue;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
