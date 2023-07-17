const { Pool } = require('pg');
const { nanoid } = require('nanoid');

const InvariantError = require('../../../exceptions/client/InvariantError');
const NotFoundError = require('../../../exceptions/client/NotFoundError');

const MapAlbumsIntoModels = require('../../utils/map/albums');
const MapSongsIntoModels = require('../../utils/map/songs');

class AlbumsService {
  constructor(albumLikesService) {
    this._pool = new Pool();
    this._cacheService = albumLikesService;
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
      throw new InvariantError('Gagal menambahkan album');
    }

    return result.rows[0].id;
  }

  async getAlbums() {
    const result = await this._pool.query('SELECT id, name, year FROM albums');
    if (!result.rowCount) {
      throw new NotFoundError('Gagal mendapatkan data album');
    }

    const mappedResult = result.rows.map(MapAlbumsIntoModels);

    return mappedResult;
  }

  async getAlbumsById(id) {
    const query = {
      text: 'SELECT id, name, year, cover_url FROM albums WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount > 0) {
      throw new NotFoundError('Gagal mendapatkan album. Id tidak ditemukan');
    }

    const mappedResult = result.rows.map(MapAlbumsIntoModels)[0];

    return mappedResult;
  }

  async editAlbumsById(id, { name, year }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE albums SET name=$1, year=$2, updated_at=$3 WHERE id = $4 RETURNING id',
      values: [name, year, updatedAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }
  }

  async deleteAlbumsById(id, userId) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Gagal menghapus album. Id tidak ditemukan');
    }

    await this._cacheService.delete(`album/${id}:${userId}`);
  }

  async getSongsByAlbumId(albumId) {
    const query = {
      text: 'SELECT id, title, performer FROM songs WHERE album_id = $1',
      values: [albumId],
    };

    const result = await this._pool.query(query);
    return result.rows.map(MapSongsIntoModels);
  }

  async verifyAlbum(albumId) {
    const query = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Gagal mendapatkan album, Id tidak ditemukan.');
    }
  }

  async isAlreadyLikes(userId, albumId) {
    const query = {
      text: 'SELECT * FROM user_album_likes WHERE album_id = $1 AND user_id = $2',
      values: [albumId, userId],
    };

    const result = await this._pool.query(query);
    if (result.rowCount > 0) {
      throw new InvariantError(`User ${userId} telah menyukai album.`);
    }
  }

  async addLikes(userId, albumId) {
    await this.verifyAlbum(albumId);

    const id = `likes-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO user_album_likes VALUES ($1, $2, $3) RETURNING id',
      values: [id, albumId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Gagal menambahkan likes');
    }

    await this._cacheService.delete(`album-likes:${albumId}`);
  }

  async getLikes(albumId) {
    try {
      const result = await this._cacheService.get(`album-likes:${albumId}`);
      const likes = JSON.parse(result);
      return {
        likes,
        cache: true,
      };
    } catch (error) {
      const query = {
        text: `
        SELECT 
          COUNT(*)
          FROM user_album_likes
            WHERE album_id = $1
            GROUP BY album_id
      `,
        values: [albumId],
      };

      const result = await this._pool.query(query);
      const likes = parseInt(result.rows[0].count, 10);

      await this._cacheService.set(
        `album-likes:${albumId}`,
        JSON.stringify(likes)
      );

      return {
        likes,
        cache: false,
      };
    }
  }

  async deleteLikes(userId, albumId) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE album_id = $1 AND user_id = $2',
      values: [albumId, userId],
    };

    await this._pool.query(query);

    await this._cacheService.delete(`album-likes:${albumId}`);
  }
}

module.exports = AlbumsService;
