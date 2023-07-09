/* eslint-disable no-underscore-dangle */

const autoBind = require('auto-bind');

class AlbumsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async addAlbumsHandler(req, res) {
    this._validator.validateAlbums(req.payload);
    const albumId = await this._service.addAlbums(req.payload);
    const response = res.response({
      status: 'success',
      message: 'Berhasil menambahkan album',
      data: {
        albumId,
      },
    });
    response.code(201);
    return response;
  }

  async getAlbumsHandler() {
    const albums = await this._service.getAlbums();
    return {
      status: 'success',
      message: 'Berhasil mendapatkan album',
      data: {
        albums,
      },
    };
  }

  async getAlbumsByIdHandler(req) {
    const { id } = req.params;
    const resultAlbum = await this._service.getAlbumsById(id);
    const songs = await this._service.getSongsByAlbumId(id);
    const { name, year } = resultAlbum;

    return {
      status: 'success',
      message: 'Berhasil mendapatkan album',
      data: {
        album: {
          id,
          name,
          year,
          songs,
        },
      },
    };
  }

  async editAlbumsByIdHandler(req) {
    this._validator.validateAlbums(req.payload);
    const { id } = req.params;
    await this._service.editAlbumsById(id, req.payload);
    return {
      status: 'success',
      message: 'Berhasil memperbarui album',
    };
  }

  async deleteAlbumsByIdHandler(req) {
    const { id } = req.params;
    await this._service.deleteAlbumsById(id);
    return {
      status: 'success',
      message: 'Berhasil menghapus album',
    };
  }
}

module.exports = AlbumsHandler;