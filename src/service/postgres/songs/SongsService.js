/* eslint-disable operator-linebreak */
/* eslint-disable comma-dangle */
/* eslint-disable object-curly-newline */
/* eslint-disable no-underscore-dangle */

const { Pool } = require('pg');
const { nanoid } = require('nanoid');

// custom error handling
const InvariantError = require('../../../exceptions/client/InvariantError');
const NotFoundError = require('../../../exceptions/client/NotFoundError');

// map
const MapSongsIntoModels = require('../../utils/map/songs');

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSongs({ title, year, genre, performer, duration, albumId }) {
    const id = `songs-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO songs VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
      values: [
        id,
        title,
        year,
        genre,
        performer,
        duration,
        albumId,
        createdAt,
        updatedAt,
      ],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Gagal menambahkan lagu');
    }

    return result.rows[0].id;
  }

  async getSongs() {
    const result = await this._pool.query(
      'SELECT id, title, performer FROM songs'
    );

    if (!result.rows.length > 0) {
      throw new NotFoundError('Gagal mendapatkan lagu');
    }

    return result.rows;
  }

  async getSongsById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length > 0) {
      throw new NotFoundError('Gagal mendapatkan lagu. Id tidak ditemukan');
    }

    return result.rows.map(MapSongsIntoModels)[0];
  }

  async editSongsById(
    id,
    { title, year, genre, performer, duration, albumId }
  ) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE songs SET title=$1, year=$2, genre=$3, performer=$4, duration=$5, album_id=$6, updated_at=$7 WHERE id = $8 RETURNING id',
      values: [title, year, genre, performer, duration, albumId, updatedAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui lagu. Id tidak ditemukan');
    }
  }

  async deleteSongsById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus lagu. Id tidak ditemukan');
    }
  }

  async searchByTitleAndPerformer({ title, performer }) {
    const query = {};
    if (title !== undefined && performer !== undefined) {
      query.text =
        'SELECT id, title, performer FROM songs WHERE LOWER(title) LIKE $1 AND LOWER(performer) LIKE $2';
      query.values = [`%${title}%`, `%${performer}%`];
    }

    if (title !== undefined) {
      query.text =
        'SELECT id, title, performer FROM songs WHERE LOWER(title) LIKE $1';
      query.values = [`%${title}%`];
    }

    if (performer !== undefined) {
      query.text =
        'SELECT id, title, performer FROM songs WHERE LOWER(performer) LIKE $1';
      query.values = [`%${performer}%`];
    }

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError(
        'Gagal mendapatkan lagu. Keyword mungkin tidak sesuai'
      );
    }

    return result.rows.map(MapSongsIntoModels);
  }

  async verifySong(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Gagal mendapatkan lagu, Id tidak ditemukan');
    }
  }
}

module.exports = SongsService;
