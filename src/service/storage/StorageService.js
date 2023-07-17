const fs = require('fs');
const { Pool } = require('pg');
const config = require('../utils/config');
const InvariantError = require('../../exceptions/client/InvariantError');

class StorageService {
  constructor(folder) {
    this._folder = folder;
    this._pool = new Pool();

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
  }

  writeFile(file, meta) {
    const filename = +new Date() + meta.filename;
    const path = `${this._folder}/${filename}`;

    const fileStream = fs.createWriteStream(path);

    return new Promise((resolve, reject) => {
      fileStream.on('error', (error) => reject(error));
      file.pipe(fileStream);
      file.on('end', () => resolve(filename));
    });
  }

  async addCoverUrlAlbums(albumId, filename) {
    const query = {
      text: 'UPDATE albums SET cover_url = $1 WHERE id = $2',
      values: [
        `http://${config.server.host}:${config.server.port}/albums/${albumId}/covers/${filename}`,
        albumId,
      ],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Gagal menambahkan url cover album.');
    }
  }
}

module.exports = StorageService;
