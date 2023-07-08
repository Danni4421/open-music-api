const Joi = require('joi');

const SongsValidationPayload = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().required(),
  genre: Joi.string().required(),
  performer: Joi.string().required(),
  duration: Joi.number(),
  albumId: Joi.string(),
});

const AlbumsValidationPayload = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().required(),
});

module.exports = { SongsValidationPayload, AlbumsValidationPayload };
