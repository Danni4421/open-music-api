const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const InvariantError = require('../../../exceptions/client/InvariantError');
const NotFoundError = require('../../../exceptions/client/NotFoundError');
const AuthenticationsError = require('../../../exceptions/client/AuthenticationsError');

class UsersService {
  constructor() {
    this._pool = new Pool();
  }

  async addUser({ username, password, fullname }) {
    await this.verifyNewUsername(username);

    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = {
      text: 'INSERT INTO users VALUES ($1, $2, $3, $4) RETURNING id',
      values: [id, username, hashedPassword, fullname],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Gagal menambahkan User.');
    }

    return result.rows[0].id;
  }

  async verifyNewUsername(username) {
    const query = {
      text: 'SELECT * FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    if (result.rowCount > 0) {
      throw new InvariantError(
        'Gagal menambahkan user. Username sudah digunakan.'
      );
    }
  }

  async deleteUserById(id) {
    const query = {
      text: 'DELETE FROM users WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Gagal menghapus User. Id tidak ditemukan');
    }
  }

  async verifyUserCredential(username, password) {
    const query = {
      text: 'SELECT id, password FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthenticationsError(
        'Kredensial yang Anda berikan tidak valid.'
      );
    }

    const { id, password: hashedPassword } = result.rows[0];

    const isMatch = await bcrypt.compare(password, hashedPassword);

    if (!isMatch) {
      throw new AuthenticationsError(
        'Kredensial yang Anda berikan tidak valid'
      );
    }

    return id;
  }
}

module.exports = UsersService;
