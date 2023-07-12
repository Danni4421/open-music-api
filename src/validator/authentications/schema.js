const Joi = require('joi');

const PostAuthenticationsPayloadSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const PutAuthenticationsPayloadSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

const DeleteAuthenticationsPayloadSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

module.exports = {
  PostAuthenticationsPayloadSchema,
  PutAuthenticationsPayloadSchema,
  DeleteAuthenticationsPayloadSchema,
};
