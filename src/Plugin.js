// songs
const songs = require('./api/songs');
const SongsPayloadValidator = require('./validator/songs');
const SongsService = require('./service/postgres/songs/SongsService');

// albums
const albums = require('./api/albums');
const AlbumsPayloadValidator = require('./validator/albums');
const AlbumsService = require('./service/postgres/albums/AlbumsService');

// users
const users = require('./api/users');
const UserValidator = require('./validator/users');
const UsersService = require('./service/postgres/users/UsersService');

// authentications
const authentications = require('./api/authentications');
const AuthenticationsValidator = require('./validator/authentications');
const AuthenticationsService = require('./service/postgres/authentications/AuthenticationsService');
const TokenManager = require('./tokenize/TokenManager');

// playlists
const playlists = require('./api/playlists');
const PlaylistsValidator = require('./validator/playlists');
const PlaylistService = require('./service/postgres/playlists/PlaylistsService');

const HapiPlugin = async (server) => {
  const albumsService = new AlbumsService();
  const songsService = new SongsService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const playlistsService = new PlaylistService(songsService);

  await server.register([
    {
      plugin: albums,
      options: {
        service: albumsService,
        validator: AlbumsPayloadValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongsPayloadValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UserValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: playlists,
      options: {
        service: playlistsService,
        validator: PlaylistsValidator,
      },
    },
  ]);
};

module.exports = HapiPlugin;
