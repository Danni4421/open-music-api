const routes = (handler) => [
  // routes albums
  {
    method: 'POST',
    path: '/albums',
    handler: handler.addAlbumsHandler,
  },
  {
    method: 'GET',
    path: '/albums',
    handler: handler.getAlbumsHandler,
  },
  {
    method: 'GET',
    path: '/albums/{id}',
    handler: handler.getAlbumsByIdHandler,
  },
  {
    method: 'PUT',
    path: '/albums/{id}',
    handler: handler.editAlbumsByIdHandler,
  },
  {
    method: 'DELETE',
    path: '/albums/{id}',
    handler: handler.deleteAlbumsByIdHandler,
  },

  // routes songs
  {
    method: 'POST',
    path: '/songs',
    handler: handler.addSongsHandler,
  },
  {
    method: 'GET',
    path: '/songs',
    handler: handler.getSongsHandler,
  },
  {
    method: 'GET',
    path: '/songs/{id}',
    handler: handler.getSongsByIdHandler,
  },
  {
    method: 'PUT',
    path: '/songs/{id}',
    handler: handler.putSongsByIdHandler,
  },
  {
    method: 'DELETE',
    path: '/songs/{id}',
    handler: handler.deleteSongsByIdHandler,
  },
];

module.exports = routes;
