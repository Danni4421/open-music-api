/* eslint-disable import/no-extraneous-dependencies */
require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const inert = require('@hapi/inert');
const config = require('./service/utils/config');

const ErrorHandling = require('./ErrorHandling');
const HapiPlugin = require('./Plugin');

const init = async () => {
  const server = Hapi.server({
    host: config.server.host,
    port: config.server.port,
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
    {
      plugin: inert,
    },
  ]);

  server.auth.strategy('openmusic_jwt', 'jwt', {
    keys: config.jwt.accessTokenKey,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: config.jwt.tokenAge,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await HapiPlugin(server);

  ErrorHandling(server);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
