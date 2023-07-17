// eslint-disable-next-line import/no-extraneous-dependencies
const redis = require('redis');
const config = require('../utils/config');

class AlbumLikesCache {
  constructor() {
    this._client = redis.createClient({
      socket: {
        host: config.redis.host,
      },
    });

    this._client.on('error', (error) => {
      console.log(error);
    });

    this._client.connect();
  }

  async set(key, values, expirationTime = 1800) {
    await this._client.set(key, values, {
      EX: expirationTime,
    });
  }

  async get(key) {
    const result = await this._client.get(key);

    if (result === null) {
      throw new Error('Cache tidak ditemukan.');
    }
    return result;
  }

  async delete(key) {
    return this._client.del(key);
  }
}

module.exports = AlbumLikesCache;
