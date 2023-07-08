const { nanoid } = require('nanoid');
const { Pool } = require('pg');

// custom error handling
const ClientError = require('../../exceptions/client/ClientError');
const InvariantError = require('../../exceptions/client/InvariantError');
const NotFoundError = require('../../exceptions/client/NotFoundError');

// parser
const MapDBToModels = require('../utils/MapDBToModels');
const { mapSongsToModels, mapAlbumsToModels } = MapDBToModels;

class OpenMusicService {
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
      throw new InvariantError('Musik gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getSongs() {
    const result = await this._pool.query(
      'SELECT id, title, performer FROM songs'
    );

    console.log(result);

    if (!result.rows.length > 0) {
      throw new NotFoundError('Musik tidak ditemukan');
    }

    return result.rows;
  }
}

module.exports = OpenMusicService;
