const {
  PostPlaylistsPayloadSchema,
  PostPlaylistSongsPayloadSchema,
  DeletePlaylistSongsPayloadSchema,
} = require('./schema');
const InvariantError = require('../../exceptions/client/InvariantError');

const PlaylistsValidator = {
  validatePostPlaylistsPayload: (payload) => {
    const validationResult = PostPlaylistsPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error);
    }
  },

  validatePostPlaylistSongsPayload: (payload) => {
    const validationResult = PostPlaylistSongsPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error);
    }
  },

  validateDeletePlaylistSongsPayload: (payload) => {
    const validationResult = DeletePlaylistSongsPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = PlaylistsValidator;
