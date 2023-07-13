/* eslint-disable operator-linebreak */
const InvariantError = require('../../exceptions/client/InvariantError');
const {
  PostCollaborationsPayloadSchema,
  DeleteCollaborationsPayloadSchema,
} = require('./schema');

const CollaborationsValidator = {
  validatePostCollaborationsPayload: (payload) => {
    const validationResult = PostCollaborationsPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validateDeleteCollaborationsPayload: (payload) => {
    const validationResult =
      DeleteCollaborationsPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = CollaborationsValidator;
