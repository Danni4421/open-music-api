const ExportsPayloadSchema = require('./schema');
const InvariantError = require('../../exceptions/client/InvariantError');

const ExportsValidator = {
  validateExportsPayload: (payload) => {
    const validationResult = ExportsPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = ExportsValidator;
