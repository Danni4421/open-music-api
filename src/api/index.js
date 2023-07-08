const OpenMusicHandler = require('./handler.js');
const routes = require('./routes');

module.exports = {
  name: 'OpenMusicAPI',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const openMusicHandler = new OpenMusicHandler(service, validator);
    server.route(routes(openMusicHandler));
  },
};
