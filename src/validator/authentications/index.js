/* eslint-disable operator-linebreak */
const {
  PostAuthenticationsPayloadSchema,
  PutAuthenticationsPayloadSchema,
  DeleteAuthenticationsPayloadSchema,
} = require('./schema');
const InvariantError = require('../../exceptions/client/InvariantError');

const AuthenticationsValidator = {
  validatePostAuthenticationPayload: (payload) => {
    const validationResult = PostAuthenticationsPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validatePutAuthenticationPayload: (payload) => {
    const validationResult = PutAuthenticationsPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validateDeleteAuthenticationPayload: (payload) => {
    const validationResult =
      DeleteAuthenticationsPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = AuthenticationsValidator;
