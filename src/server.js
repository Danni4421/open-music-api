require('dotenv').config();

// import
const Hapi = require('@hapi/hapi');

// songs
const songs = require('./api/songs');
const SongsPayloadValidator = require('./validator/songs');
const SongsService = require('./service/postgres/songs/SongsService');

// albums
const albums = require('./api/albums');
const AlbumsPayloadValidator = require('./validator/albums');
const AlbumsService = require('./service/postgres/albums/AlbumsService');

// users
const users = require('./api/users');
const UserValidator = require('./validator/users');
const UsersService = require('./service/postgres/users/UsersService');

// custom error handling
const ClientError = require('./exceptions/client/ClientError');
const NotFoundError = require('./exceptions/client/NotFoundError');
const InternalServerError = require('./exceptions/server/InternalServerError');
const ServiceUnavailableError = require('./exceptions/server/ServiceUnavailableError');

// init Hapi
const init = async () => {
  const albumsService = new AlbumsService();
  const songsService = new SongsService();
  const usersService = new UsersService();

  const server = Hapi.server({
    host: process.env.HOST,
    port: process.env.PORT,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: albums,
      options: {
        service: albumsService,
        validator: AlbumsPayloadValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongsPayloadValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UserValidator,
      },
    },
  ]);

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

      const serverError = res.response({
        status: 'fail',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      serverError.code(500);
      return serverError;
    }

    return res.continue;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
