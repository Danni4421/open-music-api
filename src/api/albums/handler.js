const autoBind = require('auto-bind');

class AlbumsHandler {
  constructor(service, storageService, validator, coversValidator) {
    this._service = service;
    this._storageService = storageService;
    this._validator = validator;
    this._coversValidator = coversValidator;

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
    const { name, year, coverUrl } = resultAlbum;

    return {
      status: 'success',
      message: 'Berhasil mendapatkan album',
      data: {
        album: {
          id,
          name,
          year,
          coverUrl,
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

  async postAlbumLikesByIdHandler(req, res) {
    const { id: userId } = req.auth.credentials;
    const { id: albumId } = req.params;

    await this._service.isAlreadyLikes(userId, albumId);
    await this._service.addLikes(userId, albumId);

    const response = res.response({
      status: 'success',
      message: 'Berhasil menambahkan likes',
    });
    response.code(201);
    return response;
  }

  async getAlbumLikesByIdHandler(req, res) {
    const { id: albumId } = req.params;
    const { likes, cache } = await this._service.getLikes(albumId);
    const response = res.response({
      status: 'success',
      message: 'Berhasil mendapatkan jumlah like.',
      data: {
        likes,
      },
    });
    if (cache) response.header('X-Data-Source', 'cache');
    return response;
  }

  async deleteAlbumLikesByIdHandler(req) {
    const { id: credentialId } = req.auth.credentials;
    const { id: albumId } = req.params;
    await this._service.deleteLikes(credentialId, albumId);
    return {
      status: 'success',
      message: 'Berhasil menghapus likes',
    };
  }

  async postAlbumCoversHandler(req, res) {
    const { cover } = req.payload;
    const { id: albumId } = req.params;
    this._coversValidator.validateAlbumCoversPayload(cover.hapi.headers);

    const filename = await this._storageService.writeFile(
      cover,
      cover.hapi,
      albumId
    );

    await this._storageService.addCoverUrlAlbums(albumId, filename);

    const response = res.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
      data: {
        filename,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = AlbumsHandler;
