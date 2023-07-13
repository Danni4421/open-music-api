/* eslint-disable no-underscore-dangle */
const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../../exceptions/client/InvariantError');
const NotFoundError = require('../../../exceptions/client/NotFoundError');

class CollaborationsService {
  constructor() {
    this._pool = new Pool();
  }

  async addCollaboration(playlistId, userId) {
    const id = `collab-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO collaborations VALUES ($1, $2, $3) RETURNING id',
      values: [id, playlistId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Gagal menambahkan kolaborasi');
    }

    return result.rows[0].id;
  }

  async deleteCollaboration(playlistId, userId) {
    const query = {
      text: 'DELETE FROM collaborations WHERE playlist_id = $1 AND user_id = $2 RETURNING id',
      values: [playlistId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus kolaborasi.');
    }
  }

  async verifyCollaborator(playlistId, userId) {
    const query = {
      text: 'SELECT * FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
      values: [playlistId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Kolaborasi gagal untuk diverifikasi');
    }
  }

  async verifyRequirementCollaborations(playlistId, userId) {
    const queryUser = {
      text: 'SELECT * FROM users WHERE id = $1',
      values: [userId],
    };

    const resultUser = await this._pool.query(queryUser);

    if (!resultUser.rows.length) {
      throw new NotFoundError('Gagal mendapatkan user, Id tidak ditemukan');
    }

    const queryPlaylist = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [playlistId],
    };

    const resultPlaylist = await this._pool.query(queryPlaylist);

    if (!resultPlaylist.rows.length) {
      throw new NotFoundError('Gagal mendapatkan playlist, Id tidak ditemukan');
    }
  }

  async getCollaborationsPlaylist(userId) {
    const playlistQuery = {
      text: `
        SELECT 
        playlists.id,
        playlists.name,
        (SELECT DISTINCT(username) FROM users WHERE id = playlists.owner)
        FROM collaborations 
          LEFT OUTER JOIN playlists ON playlists.id = collaborations.playlist_id
          LEFT OUTER JOIN users ON users.id = collaborations.user_id
          WHERE collaborations.user_id = $1
      `,
      values: [userId],
    };

    const playlistResult = await this._pool.query(playlistQuery);

    return playlistResult;
  }
}

module.exports = CollaborationsService;
