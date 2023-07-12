/* eslint-disable comma-dangle */
/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addConstraint(
    'activities',
    'fk_activities.playlist_id_playlists.id',
    'FOREIGN KEY (playlist_id) REFERENCES playlists(id)'
  );

  pgm.addConstraint(
    'activities',
    'fk_activities.song_id_songs.id',
    'FOREIGN KEY (song_id) REFERENCES songs(id)'
  );

  pgm.addConstraint(
    'activities',
    'fk_activities.user_id_users.id',
    'FOREIGN KEY (user_id) REFERENCES users(id)'
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint('activities', 'fk_activities.playlist_id_playlists.id');
  pgm.dropConstraint('activities', 'fk_activities.song_id_songs.id');
  pgm.dropConstraint('activities', 'fk_activities.user_id_users.id');
};
