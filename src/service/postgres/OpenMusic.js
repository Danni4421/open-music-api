/* eslint-disable comma-dangle */
/* eslint-disable object-curly-newline */
/* eslint-disable operator-linebreak */
/* eslint-disable no-underscore-dangle */

const { nanoid } = require('nanoid');
const { Pool } = require('pg');

// custom error handling
const InvariantError = require('../../exceptions/client/InvariantError');
const NotFoundError = require('../../exceptions/client/NotFoundError');

// parser
const {
  MapAlbumsIntoModels,
  MapSongsIntoModels,
} = require('../utils/MapDBToModels');

class OpenMusicService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbums({ name, year }) {
    const id = `albums-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, name, year, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Gagal menambahkan data album');
    }

    return result.rows[0].id;
  }

  async getAlbums() {
    const result = await this._pool.query('SELECT id, name, year FROM albums');
    if (!result.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    return result.rows.map(MapAlbumsIntoModels);
  }

  async getAlbumsById(id) {
    const query = {
      text: 'SELECT id, name, year FROM albums WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length > 0) {
      throw new NotFoundError('Gagal mendapatkan album. Id tidak ditemukan');
    }

    return result.rows.map(MapAlbumsIntoModels)[0];
  }

  async editAlbumsById(id, { name, year }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE albums SET name=$1, year=$2, updated_at=$3 WHERE id = $4 RETURNING id',
      values: [name, year, updatedAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }
  }

  async deleteAlbumsById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus album. Id tidak ditemukan');
    }
  }

  // eslint-disable-next-line object-curly-newline
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
      throw new InvariantError('Musik gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getSongs() {
    const result = await this._pool.query(
      'SELECT id, title, performer FROM songs'
    );

    if (!result.rows.length > 0) {
      throw new NotFoundError('Musik tidak ditemukan');
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
      throw new NotFoundError('Musik tidak ditemukan');
    }

    return result.rows.map(MapSongsIntoModels)[0];
  }

  async editSongsById(
    id,
    { title, year, genre, performer, duration, albumId }
  ) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE songs SET title=$1, year=$2, genre=$3, performer=$4, duration=$5, "albumId"=$6, updated_at=$7 WHERE id = $8 RETURNING id',
      values: [title, year, genre, performer, duration, albumId, updatedAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui Musik. Id tidak ditemukan');
    }
  }

  async deleteSongsById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus Musik. Id tidak ditemukan');
    }
  }

  async getSongsByAlbumId(albumId) {
    const query = {
      text: 'SELECT id, title, performer FROM songs WHERE "albumId" = $1',
      values: [albumId],
    };

    const result = await this._pool.query(query);
    return result.rows;
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
      throw new NotFoundError('Gagal untuk mendapatkan lagu');
    }

    return result.rows.map(MapSongsIntoModels);
  }
}

module.exports = OpenMusicService;
