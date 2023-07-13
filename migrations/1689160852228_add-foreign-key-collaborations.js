/* eslint-disable comma-dangle */
/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addConstraint(
    'collaborations',
    'fk_collaborations.playlist_id_playlists.id',
    'FOREIGN KEY (playlist_id) REFERENCES playlists(id)'
  );

  pgm.addConstraint(
    'collaborations',
    'fk_collaborations.user_id_users.id',
    'FOREIGN KEY (user_id) REFERENCES users(id)'
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint(
    'collaborations',
    'fk_collaborations.playlist_id_playlists.id'
  );

  pgm.dropConstraint('collaborations', 'fk_collaborations.user_id_users.id');
};
