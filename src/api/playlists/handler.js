/* eslint-disable no-underscore-dangle */
const autoBind = require('auto-bind');

class PlaylistsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postPlaylistsHandler(req, res) {
    this._validator.validatePostPlaylistsPayload(req.payload);
    const { name } = req.payload;
    const { id: credentialId } = req.auth.credentials;

    const playlistId = await this._service.addPlaylist(name, credentialId);
    const response = res.response({
      status: 'success',
      message: 'Berhasil membuat playlist',
      data: {
        playlistId,
      },
    });
    response.code(201);
    return response;
  }

  async getPlaylistsHandler(req) {
    const { id: credentialId } = req.auth.credentials;
    const playlists = await this._service.getPlaylists(credentialId);
    return {
      status: 'success',
      message: 'Berhasil mendapatkan playlists.',
      data: {
        playlists,
      },
    };
  }

  async deletePlaylistsByIdHandler(req) {
    const { id } = req.params;
    const { id: credentialId } = req.auth.credentials;
    await this._service.deletePlaylist(id, credentialId);
    return {
      status: 'success',
      message: 'Berhasil menghapus playlist',
    };
  }

  async postPlaylistSongsHandler(req, res) {
    this._validator.validatePostPlaylistSongsPayload(req.payload);
    const { id } = req.params;
    const { id: credentialId } = req.auth.credentials;
    await this._service.addPlaylistSong(id, credentialId, req.payload);

    const response = res.response({
      status: 'success',
      message: 'Berhasil menambahkan lagu ke playlist',
    });
    response.code(201);
    return response;
  }

  async getPlaylistSongsHandler(req) {
    const { id } = req.params;
    const { id: credentialId } = req.auth.credentials;
    const playlist = await this._service.getPlaylistSongs(id, credentialId);
    return {
      status: 'success',
      message: 'Berhasil mendapatkan playlist',
      data: {
        playlist,
      },
    };
  }

  async deletePlaylistSongsHandler(req) {
    // TODO : Validation Body Request
    this._validator.validateDeletePlaylistSongsPayload(req.payload);
    // GET : songId Value
    const { songId } = req.payload;
    // GET : Playlist id
    const { id: playlistId } = req.params;
    // GET : Credential id
    const { id: credentialId } = req.auth.credentials;
    // TODO : Execute query with passing playlistId, songId argument
    await this._service.deletePlaylistSong(playlistId, songId, credentialId);
    // TODO : return result
    return {
      status: 'success',
      message: 'Berhasil menghapus lagu pada playlist',
    };
  }
}

module.exports = PlaylistsHandler;
