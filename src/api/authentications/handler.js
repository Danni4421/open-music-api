const autoBind = require('auto-bind');

class AuthenticationsHandler {
  constructor(authenticationsService, usersService, tokenManager, validator) {
    this._authenticationsService = authenticationsService;
    this._usersService = usersService;
    this._tokenManager = tokenManager;
    this._validator = validator;

    autoBind(this);
  }

  async postAuthenticationHandler(req, res) {
    this._validator.validatePostAuthenticationPayload(req.payload);

    const { username, password } = req.payload;
    const id = await this._usersService.verifyUserCredential(
      username,
      password
    );

    const accessToken = this._tokenManager.generateAccessToken({ id });
    const refreshToken = this._tokenManager.generateRefreshToken({ id });

    await this._authenticationsService.addRefreshToken(refreshToken);

    const response = res.response({
      status: 'success',
      message: 'Berhasil mendapatkan Access Token dan Refresh Token',
      data: {
        accessToken,
        refreshToken,
      },
    });
    response.code(201);
    return response;
  }

  async putAuthenticationHandler(req, res) {
    this._validator.validatePutAuthenticationPayload(req.payload);

    const { refreshToken } = req.payload;
    await this._authenticationsService.verifyRefreshToken(refreshToken);

    const id = await this._tokenManager.verifyRefreshToken(refreshToken);
    const accessToken = await this._tokenManager.generateAccessToken({ id });

    const response = res.response({
      status: 'success',
      message: 'Berhasil memperbarui Access Token',
      data: {
        accessToken,
      },
    });
    return response;
  }

  async deleteAuthenticationHandler(req, res) {
    this._validator.validateDeleteAuthenticationPayload(req.payload);

    const { refreshToken } = req.payload;
    await this._tokenManager.verifyRefreshToken(refreshToken);
    await this._authenticationsService.deleteRefreshToken(refreshToken);

    const response = res.response({
      status: 'success',
      message: 'Berhasil menghapus refresh token',
    });
    return response;
  }
}

module.exports = AuthenticationsHandler;
