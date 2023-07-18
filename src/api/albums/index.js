const AlbumsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'albums',
  version: '1.0.1',
  register: async (server, {
    service,
    storageService,
    validator,
    coversValidator,
  }) => {
    const albumsHandler = new AlbumsHandler(
      service,
      storageService,
      validator,
      coversValidator,
    );
    server.route(routes(albumsHandler));
  },
};
