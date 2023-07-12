/* eslint-disable comma-dangle */
/* eslint-disable no-underscore-dangle */
const autoBind = require('auto-bind');

class PlaylistsHandler {
  constructor(playlistsService, activitiesService, validator) {
    this._playlistsService = playlistsService;
    this._activitiesService = activitiesService;
    this._validator = validator;

    autoBind(this);
  }

  async postPlaylistsHandler(req, res) {
    this._validator.validatePostPlaylistsPayload(req.payload);
    const { name } = req.payload;
    const { id: credentialId } = req.auth.credentials;

    const playlistId = await this._playlistsService.addPlaylist(
      name,
      credentialId
    );
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
    const playlists = await this._playlistsService.getPlaylists(credentialId);
    return {
      status: 'success',
      message: 'Berhasil mendapatkan playlists.',
      data: {
        playlists,
      },
    };
  }

  async deletePlaylistsByIdHandler(req) {
    const { id: playlistId } = req.params;
    const { id: credentialId } = req.auth.credentials;
    await this._playlistsService.deletePlaylist(playlistId, credentialId);
    return {
      status: 'success',
      message: 'Berhasil menghapus playlist',
    };
  }

  async postPlaylistSongsHandler(req, res) {
    this._validator.validatePostPlaylistSongsPayload(req.payload);
    const { id: playlistId } = req.params;
    const { id: credentialId } = req.auth.credentials;
    const { songId } = req.payload;

    await this._playlistsService.addPlaylistSong(
      playlistId,
      credentialId,
      songId
    );

    await this._activitiesService.postActivitiesPlaylist(
      playlistId,
      songId,
      credentialId,
      'add'
    );

    const response = res.response({
      status: 'success',
      message: 'Berhasil menambahkan lagu ke playlist',
    });
    response.code(201);
    return response;
  }

  async getPlaylistSongsHandler(req) {
    const { id: playlistId } = req.params;
    const { id: credentialId } = req.auth.credentials;
    const playlist = await this._playlistsService.getPlaylistSongs(
      playlistId,
      credentialId
    );

    return {
      status: 'success',
      message: 'Berhasil mendapatkan playlist',
      data: {
        playlist,
      },
    };
  }

  async deletePlaylistSongsHandler(req) {
    this._validator.validateDeletePlaylistSongsPayload(req.payload);

    const { songId } = req.payload;
    const { id: playlistId } = req.params;
    const { id: credentialId } = req.auth.credentials;

    await this._playlistsService.deletePlaylistSong(
      playlistId,
      songId,
      credentialId
    );

    await this._activitiesService.postActivitiesPlaylist(
      playlistId,
      songId,
      credentialId,
      'delete'
    );

    console.log('Berhasil');

    return {
      status: 'success',
      message: 'Berhasil menghapus lagu pada playlist',
    };
  }

  async getPlaylistActivitiesHandler(req) {
    const { id: playlistId } = req.params;
    const { id: credentialId } = req.auth.credentials;

    await this._playlistsService.verifyPlaylist(playlistId, credentialId);
    const activities = await this._activitiesService.getActivitiesPlaylist(
      playlistId
    );
    return {
      status: 'success',
      message: 'Berhasil mendapatkan aktifitas playlist',
      data: {
        playlistId,
        activities,
      },
    };
  }
}

module.exports = PlaylistsHandler;
