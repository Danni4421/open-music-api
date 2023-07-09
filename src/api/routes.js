const routes = (albumsHandler, songsHandler) => [
  // routes albums
  {
    method: 'POST',
    path: '/albums',
    handler: albumsHandler.addAlbumsHandler,
  },
  {
    method: 'GET',
    path: '/albums',
    handler: albumsHandler.getAlbumsHandler,
  },
  {
    method: 'GET',
    path: '/albums/{id}',
    handler: albumsHandler.getAlbumsByIdHandler,
  },
  {
    method: 'PUT',
    path: '/albums/{id}',
    handler: albumsHandler.editAlbumsByIdHandler,
  },
  {
    method: 'DELETE',
    path: '/albums/{id}',
    handler: albumsHandler.deleteAlbumsByIdHandler,
  },

  // routes songs
  {
    method: 'POST',
    path: '/songs',
    handler: songsHandler.addSongsHandler,
  },
  {
    method: 'GET',
    path: '/songs',
    handler: songsHandler.getSongsHandler,
  },
  {
    method: 'GET',
    path: '/songs/{id}',
    handler: songsHandler.getSongsByIdHandler,
  },
  {
    method: 'PUT',
    path: '/songs/{id}',
    handler: songsHandler.putSongsByIdHandler,
  },
  {
    method: 'DELETE',
    path: '/songs/{id}',
    handler: songsHandler.deleteSongsByIdHandler,
  },
];

module.exports = routes;
