exports.up = (pgm) => {
  pgm.addConstraint(
    'likes',
    'fk_likes.album_id_albums.id',
    'FOREIGN KEY (album_id) REFERENCES albums(id)'
  );

  pgm.addConstraint(
    'likes',
    'fk_likes.user_id_users.id',
    'FOREIGN KEY (user_id) REFERENCES users(id)'
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint('likes', 'fk_likes.album_id_albums.id');
  pgm.dropConstraint('likes', 'fk_likes.user_id_users.id');
};
