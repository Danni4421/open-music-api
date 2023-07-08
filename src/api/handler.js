const autoBind = require('auto-bind');

class OpenMusicHandler {
  constructor(service, { validateSongs, validateAlbums }) {
    this._service = service;
    this._validateSongs = validateSongs;
    this._validateAlbums = validateAlbums;

    autoBind(this);
  }

  async addSongsHandler(req, res) {
    this._validateSongs(req.payload);
    const songId = await this._service.addSongs(req.payload);

    const response = res.response({
      status: 'success',
      data: {
        songId: songId,
      },
    });
    response.code(201);
    return response;
  }

  async getSongsHandler() {
    const songs = await this._service.getSongs();

    console.log('Result Songs : ');
    console.log(songs);

    return {
      status: 'success',
      data: {
        songs,
      },
    };
  }
}

module.exports = OpenMusicHandler;
