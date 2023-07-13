const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../../exceptions/client/InvariantError');
const NotFoundError = require('../../../exceptions/client/NotFoundError');
const AuthorizationsError = require('../../../exceptions/client/AuthorizationsError');

class PlaylistService {
  constructor(songsService, collaborationsService) {
    this._pool = new Pool();
    this._songsService = songsService;
    this._collaborationsService = collaborationsService;
  }

  async verifyPlaylistAccess(playlistId, credentialId) {
    try {
      await this.verifyPlaylistOwner(playlistId, credentialId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }

      try {
        await this._collaborationsService.verifyCollaborator(
          playlistId,
          credentialId
        );
      } catch {
        throw error;
      }
    }
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
    const collaborationsPlaylist =
      await this._collaborationsService.getCollaborationsPlaylist(credentialId);

    collaborationsPlaylist.rows.map((p) => result.rows.push(p));

    return result.rows;
  }

  async deletePlaylist(playlistId) {
    const playlistSongsQuery = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1',
      values: [playlistId],
    };

    await this._pool.query(playlistSongsQuery);

    const playlistsActivitiesQuery = {
      text: 'DELETE FROM activities WHERE playlist_id = $1',
      values: [playlistId],
    };

    await this._pool.query(playlistsActivitiesQuery);

    const collaborationQuery = {
      text: 'DELETE FROM collaborations WHERE playlist_id = $1',
      values: [playlistId],
    };

    await this._pool.query(collaborationQuery);

    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Gagal menghapus playlist, Id tidak ditemukan.');
    }
  }

  async addPlaylistSong(playlistId, songId) {
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

  async getPlaylistSongs(playlistId) {
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
      values: [playlistId],
    };

    const playlistResult = await this._pool.query(playlistQuery);

    if (!playlistResult.rows.length) {
      throw new NotFoundError(
        'Gagal mendapatkan playlist, Id tidak ditemukan.'
      );
    }

    const { name, username } = playlistResult.rows[0];

    const songs = await this._songsService.getSongsByPlaylistId(playlistId);

    const result = {
      id: playlistId,
      name,
      username,
      songs,
    };

    return result;
  }

  async deletePlaylistSong(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Playlist atau Lagu tidak ditemukan.');
    }
  }

  async verifyPlaylistOwner(playlistId, ownerId) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
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
