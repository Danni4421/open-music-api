/* eslint-disable comma-dangle */
/* eslint-disable no-underscore-dangle */
const { nanoid } = require('nanoid');
const { Pool } = require('pg');

// exceptions
const InvariantError = require('../../../exceptions/client/InvariantError');
const NotFoundError = require('../../../exceptions/client/NotFoundError');
const AuthorizationsError = require('../../../exceptions/client/AuthorizationsError');

class PlaylistService {
  constructor(songsService) {
    this._pool = new Pool();
    this._songsService = songsService;
  }

  async addPlaylist(name, credentialId) {
    const id = `playlist-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlists VALUES ($1, $2, $3) RETURNING id',
      values: [id, name, credentialId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Gagal membuat playlist.');
    }

    return result.rows[0].id;
  }

  async getPlaylists(credentialId) {
    const query = {
      text: `
      SELECT 
      playlists.id,
      playlists.name,
      users.username
       FROM playlists 
        LEFT JOIN users ON users.id = playlists.owner
        WHERE owner = $1`,
      values: [credentialId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan.');
    }

    return result.rows;
  }

  async deletePlaylist(id, ownerId) {
    await this.verifyPlaylist(id, ownerId);
    const playlistSongsQuery = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1',
      values: [id],
    };

    await this._pool.query(playlistSongsQuery);

    const playlistsActivitiesQuery = {
      text: 'DELETE FROM activities WHERE playlist_id = $1',
      values: [id],
    };

    await this._pool.query(playlistsActivitiesQuery);

    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus playlist, Id tidak ditemukan.');
    }
  }

  async addPlaylistSong(playlistId, ownerId, songId) {
    await this.verifyPlaylist(playlistId, ownerId);
    await this._songsService.verifySong(songId);

    const playlistSongsId = `playlist-songs-${nanoid(16)}`;

    const songQuery = {
      text: 'INSERT INTO playlist_songs VALUES ($1, $2, $3) RETURNING id',
      values: [playlistSongsId, playlistId, songId],
    };

    const result = await this._pool.query(songQuery);

    if (!result.rows[0].id) {
      throw new InvariantError('Gagal menambahkan lagu ke playlist.');
    }
  }

  async getPlaylistSongs(id, owner) {
    const playlistQuery = {
      text: `
        SELECT 
        users.id,
        playlists.name,
        users.username
        FROM playlists 
          LEFT OUTER JOIN users ON users.id = playlists.owner
          WHERE playlists.id = $1
      `,
      values: [id],
    };

    const playlistResult = await this._pool.query(playlistQuery);

    if (!playlistResult.rows.length) {
      throw new NotFoundError(
        'Gagal mendapatkan playlist, Id tidak ditemukan.'
      );
    }

    const { id: ownerId, name, username } = playlistResult.rows[0];

    if (owner !== ownerId) {
      throw new AuthorizationsError(
        'Gagal untuk mendapatkan lagu, Anda bukan pemilik playlist.'
      );
    }

    const songsQuery = {
      text: `
        SELECT 
          songs.id,
          songs.title,
          songs.performer
          FROM playlist_songs
            LEFT JOIN songs ON songs.id = playlist_songs.song_id
            WHERE playlist_songs.playlist_id = $1
      `,
      values: [id],
    };

    const songs = await this._pool.query(songsQuery);

    const result = {
      id,
      name,
      username,
      songs: songs.rows,
    };

    return result;
  }

  async deletePlaylistSong(playlistId, songId, ownerId) {
    await this.verifyPlaylist(playlistId, ownerId);
    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist atau Lagu tidak ditemukan.');
    }
  }

  async verifyPlaylist(playlistId, ownerId) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal menemukan playlist, Id tidak ditemukan.');
    }

    const { owner } = result.rows[0];

    if (ownerId !== owner) {
      throw new AuthorizationsError(
        'Gagal memuat playlist, Anda bukan pemilik playlist.'
      );
    }
  }
}

module.exports = PlaylistService;
