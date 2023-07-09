/* eslint-disable no-underscore-dangle */
const autoBind = require('auto-bind');

class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async addSongsHandler(req, res) {
    this._validator.validateSongs(req.payload);
    const songId = await this._service.addSongs(req.payload);
    const response = res.response({
      status: 'success',
      message: 'Berhasil menambahkan lagu',
      data: {
        songId,
      },
    });
    response.code(201);
    return response;
  }

  async getSongsHandler(req) {
    const { title, performer } = req.query;
    if (title || performer) {
      const songs = await this._service.searchByTitleAndPerformer(req.query);

      return {
        status: 'success',
        message: 'Berhasil mendapatkan lagu',
        data: {
          songs,
        },
      };
    }

    const songs = await this._service.getSongs();
    return {
      status: 'success',
      message: 'Berhasil mendapatkan lagu',
      data: {
        songs,
      },
    };
  }

  async getSongsByIdHandler(req) {
    const { id } = req.params;
    const song = await this._service.getSongsById(id);
    return {
      status: 'success',
      message: 'Berhasil mendapatkan lagu',
      data: {
        song,
      },
    };
  }

  async putSongsByIdHandler(req) {
    this._validator.validateSongs(req.payload);
    const { id } = req.params;
    await this._service.editSongsById(id, req.payload);
    return {
      status: 'success',
      message: 'Berhasil memperbarui lagu',
    };
  }

  async deleteSongsByIdHandler(req) {
    const { id } = req.params;
    await this._service.deleteSongsById(id);
    return {
      status: 'success',
      message: 'Berhasil menghapus lagu',
    };
  }
}

module.exports = SongsHandler;
