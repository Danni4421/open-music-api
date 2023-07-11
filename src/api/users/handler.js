/* eslint-disable no-underscore-dangle */
const autoBind = require('auto-bind');

class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postUserHandler(req, res) {
    this._validator.validateUserPayload(req.payload);
    const userId = await this._service.addUser(req.payload);
    const response = res.response({
      status: 'success',
      message: 'Berhasil menambahkan user.',
      data: {
        userId,
      },
    });
    response.code(201);
    return response;
  }

  async deleteUserHandler(req) {
    const { id = '' } = req.payload;
    await this._service.deleteUserById(id);
    return {
      status: 'success',
      message: 'Berhasil menghapus User',
    };
  }
}

module.exports = UsersHandler;
