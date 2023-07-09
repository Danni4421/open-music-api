/* eslint-disable comma-dangle */
const routes = require('./routes');
const AlbumsHandler = require('./handler/albums');
const SongsHandler = require('./handler/songs');

module.exports = {
  name: 'OpenMusicAPI',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const { albumsService, songsService } = service;
    const { AlbumsPayloadValidator, SongsPayloadValidator } = validator;
    const albumsHandler = new AlbumsHandler(
      albumsService,
      AlbumsPayloadValidator
    );
    const songsHandler = new SongsHandler(songsService, SongsPayloadValidator);
    server.route(routes(albumsHandler, songsHandler));
  },
};
