const AlbumCoversPayloadSchema = require('./schema');
const InvariantError = require('../../exceptions/client/InvariantError');

const AlbumCoversValidator = {
  validateAlbumCoversPayload: (headers) => {
    const validationResult = AlbumCoversPayloadSchema.validate(headers);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = AlbumCoversValidator;
