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
    const { id: playlistId } = req.params;
    const { targetEmail } = req.payload;
    console.log(userId, playlistId, targetEmail);
    this._validator.validateExportsPayload(req.payload);

    await this._playlistService.verifyPlaylistAccess(playlistId, userId);

    const playlist = await this._playlistService.getPlaylistSongs(playlistId);
    const { id, name, songs } = playlist;

    const message = {
      userId,
      targetEmail,
      playlist: {
        id,
        name,
        songs,
      },
    };

    await this._exportsService.sendMessage(
      `playlist:${userId}`,
      JSON.stringify(message)
    );

    const response = res.response({
      status: 'success',
      message: 'Berhasil melakukan ekspor playlist',
    });
    response.code(201);
    return response;
  }
}

module.exports = ExportsHandler;
