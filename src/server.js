/* eslint-disable import/no-extraneous-dependencies */

require('dotenv').config();

// import
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');

// Error Handler
const ErrorHandling = require('./ErrorHandling');
const HapiPlugin = require('./Plugin');

// init Hapi
const init = async () => {
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

  // Server plugin
  await HapiPlugin(server);

  // onPreResponse
  ErrorHandling(server);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
