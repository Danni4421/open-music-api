const ClientError = require('./exceptions/client/ClientError');
const AuthenticationsError = require('./exceptions/client/AuthenticationsError');
const AuthorizationsError = require('./exceptions/client/AuthorizationsError');
const NotFoundError = require('./exceptions/client/NotFoundError');
const InternalServerError = require('./exceptions/server/InternalServerError');
const ServiceUnavailableError = require('./exceptions/server/ServiceUnavailableError');

const ErrorHandling = (server) => {
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
};

module.exports = ErrorHandling;
