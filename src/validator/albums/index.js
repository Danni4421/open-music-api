const InvariantError = require('../../exceptions/client/InvariantError');
const AlbumsPayloadSchema = require('./schema');

const AlbumsPayloadValidator = {
  validateAlbums: (payload) => {
    const validationResult = AlbumsPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError('Bad Request');
    }
  },
};

module.exports = AlbumsPayloadValidator;
