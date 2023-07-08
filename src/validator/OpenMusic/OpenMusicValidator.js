const ClientError = require('../../exceptions/client/ClientError');
const { AlbumsValidationPayload, SongsValidationPayload } = require('./schema');

const OpenMusicValidator = {
  validateSongs: (payload) => {
    const songsValidationResult = SongsValidationPayload.validate(payload);
    if (songsValidationResult.error) {
      throw new ClientError('Bad Request');
    }
  },

  validateAlbums: (payload) => {
    const albumsValidationResult = AlbumsValidationPayload.validate(payload);
    if (albumsValidationResult.error) {
      throw new ClientError('Bad Request');
    }
  },
};

module.exports = OpenMusicValidator;
