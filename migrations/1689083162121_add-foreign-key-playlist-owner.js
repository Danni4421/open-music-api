exports.up = (pgm) => {
  pgm.addConstraint(
    'playlists',
    'fk_playlists.owner_users.id',
    'FOREIGN KEY (owner) REFERENCES users(id)'
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint('playlists', 'fk_playlists.owner_users.id');
};
