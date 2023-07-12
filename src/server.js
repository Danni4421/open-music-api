/* eslint-disable import/no-extraneous-dependencies */

require('dotenv').config();

// import
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');

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

// authentications
const authentications = require('./api/authentications');
const AuthenticationsValidator = require('./validator/authentications');
const AuthenticationsService = require('./service/postgres/authentications/AuthenticationsService');
const TokenManager = require('./tokenize/TokenManager');

// playlist
const playlists = require('./api/playlists');
const PlaylistsValidator = require('./validator/playlists');
const PlaylistService = require('./service/postgres/playlists/PlaylistsService');

// custom error handling
const ClientError = require('./exceptions/client/ClientError');
const AuthenticationsError = require('./exceptions/client/AuthenticationsError');
const AuthorizationsError = require('./exceptions/client/AuthorizationsError');
const NotFoundError = require('./exceptions/client/NotFoundError');
const InternalServerError = require('./exceptions/server/InternalServerError');
const ServiceUnavailableError = require('./exceptions/server/ServiceUnavailableError');

// init Hapi
const init = async () => {
  const albumsService = new AlbumsService();
  const songsService = new SongsService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const playlistsService = new PlaylistService(songsService);

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
      plugin: Jwt,
    },
  ]);

  server.auth.strategy('openmusic_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
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
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: playlists,
      options: {
        service: playlistsService,
        validator: PlaylistsValidator,
      },
    },
  ]);

  // onPreResponse
  server.ext('onPreResponse', (req, res) => {
    const { response } = req;

    if (response instanceof Error) {
      if (response instanceof AuthenticationsError) {
        const authenticationsError = res.response({
          status: 'fail',
          message: response.message,
        });
        authenticationsError.code(response.statusCode);
        return authenticationsError;
      }

      if (response instanceof AuthorizationsError) {
        const authorizationsError = res.response({
          status: 'fail',
          message: response.message,
        });
        authorizationsError.code(response.statusCode);
        return authorizationsError;
      }

      if (response instanceof NotFoundError) {
        const notFoundError = res.response({
          status: 'fail',
          message: response.message,
        });
        notFoundError.code(response.statusCode);
        return notFoundError;
      }

      if (response instanceof ClientError) {
        const clientErrorResponse = res.response({
          status: 'fail',
          message: response.message,
        });
        clientErrorResponse.code(response.statusCode);
        return clientErrorResponse;
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
