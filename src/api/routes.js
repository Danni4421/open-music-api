const routes = (handler) => [
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
  // {
  //   method: 'GET',
  //   path: '/songs/{id}',
  //   handler: '',
  // },
  // {
  //   method: 'PUT',
  //   path: '/songs/{id}',
  //   handler: '',
  // },
  // {
  //   method: 'DELETE',
  //   path: '/songs/{id}',
  //   handler: '',
  // },
];

module.exports = routes;
