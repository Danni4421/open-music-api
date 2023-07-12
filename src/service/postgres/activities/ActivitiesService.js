/* eslint-disable no-underscore-dangle */
const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../../exceptions/client/InvariantError');

class ActivitiesService {
  constructor() {
    this._pool = new Pool();
  }

  async postActivitiesPlaylist(playlistId, songId, credentialId, action) {
    const id = `activities-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO activities VALUES ($1, $2, $3, $4, $5, (to_timestamp($6 / 1000.0))) RETURNING id',
      values: [id, playlistId, songId, credentialId, action, `${Date.now()}`],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Gagal menambahkan aktifitas');
    }
  }

  async getActivitiesPlaylist(playlistId) {
    const query = {
      text: `
      SELECT 
      users.username,
      songs.title,
      activities.action,
      activities.time
      FROM activities 
        LEFT JOIN users ON users.id = activities.user_id
        LEFT JOIN songs ON songs.id = activities.song_id
      WHERE playlist_id = $1`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }
}

module.exports = ActivitiesService;
