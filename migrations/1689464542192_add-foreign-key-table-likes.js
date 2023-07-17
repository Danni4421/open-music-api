exports.up = (pgm) => {
  pgm.addConstraint(
    'user_album_likes',
    'fk_user_album_likes.album_id_albums.id',
    'FOREIGN KEY (album_id) REFERENCES albums(id)'
  );

  pgm.addConstraint(
    'user_album_likes',
    'fk_user_album_likes.user_id_users.id',
    'FOREIGN KEY (user_id) REFERENCES users(id)'
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint(
    'user_album_likes',
    'fk_user_album_likes.album_id_albums.id'
  );
  pgm.dropConstraint(
    'user_album_likes',
    'fk_user_album_likes.user_id_users.id'
  );
};
