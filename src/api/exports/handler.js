const autoBind = require('auto-bind');

class ExportsHandler {
  constructor(exportService, playlistService, validator) {
    this._exportsService = exportService;
    this._playlistService = playlistService;
    this._validator = validator;

    autoBind(this);
  }

  async postExportPlaylistHandler(req, res) {
    const { id: userId } = req.auth.credentials;
    const { playlistId } = req.params;
    const { targetEmail } = req.payload;
    this._validator.validateExportsPayload(req.payload);

    await this._playlistService.verifyPlaylistAccess(playlistId, userId);

    const message = {
      playlistId,
      targetEmail,
    };

    await this._exportsService.sendMessage(
      'export:playlist',
      JSON.stringify(message),
    );

    const response = res.response({
      status: 'success',
      message: 'Permintaan Anda sedang kami proses',
    });
    response.code(201);
    return response;
  }
}

module.exports = ExportsHandler;
