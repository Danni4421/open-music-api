const autoBind = require('auto-bind');

class CollaborationsHandler {
  constructor(collaborationsService, playlistsService, validator) {
    this._collaborationsService = collaborationsService;
    this._playlistsService = playlistsService;
    this._validator = validator;

    autoBind(this);
  }

  async postCollaborationsHandler(req, res) {
    this._validator.validatePostCollaborationsPayload(req.payload);
    const { playlistId, userId } = req.payload;
    const { id: credentialId } = req.auth.credentials;

    await this._collaborationsService.verifyRequirementCollaborations(
      playlistId,
      userId
    );

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    const collaborationId = await this._collaborationsService.addCollaboration(
      playlistId,
      userId
    );

    const response = res.response({
      status: 'success',
      message: 'Berhasil membuat kolaborasi',
      data: {
        collaborationId,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCollaborationsHandler(req) {
    this._validator.validateDeleteCollaborationsPayload(req.payload);
    const { playlistId, userId } = req.payload;
    const { id: credentialId } = req.auth.credentials;

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    await this._collaborationsService.deleteCollaboration(playlistId, userId);

    return {
      status: 'success',
      message: 'Berhasil menghapus kolaborasi',
    };
  }
}

module.exports = CollaborationsHandler;
