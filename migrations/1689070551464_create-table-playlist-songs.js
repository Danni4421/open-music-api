/* eslint-disable comma-dangle */
/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.createTable('playlist_songs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    song_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  pgm.addConstraint(
    'playlist_songs',
    'fk_playlist_songs.playlist_id_playlists.id',
    'FOREIGN KEY (playlist_id) REFERENCES playlists(id)'
  );

  pgm.addConstraint(
    'playlist_songs',
    'fk_playlist_songs.song_id_songs.id',
    'FOREIGN KEY (song_id) REFERENCES songs(id)'
  );
};

exports.down = (pgm) => {
  pgm.dropTable('playlist_songs');
};
