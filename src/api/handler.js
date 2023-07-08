/* eslint-disable no-underscore-dangle */
const autoBind = require('auto-bind');

class OpenMusicHandler {
  constructor(service, { validateSongs, validateAlbums }) {
    this._service = service;
    this._validateSongs = validateSongs;
    this._validateAlbums = validateAlbums;

    autoBind(this);
  }

  async addAlbumsHandler(req, res) {
    this._validateAlbums(req.payload);
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
    this._validateAlbums(req.payload);
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

  async addSongsHandler(req, res) {
    this._validateSongs(req.payload);
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
    this._validateSongs(req.payload);
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

module.exports = OpenMusicHandler;
