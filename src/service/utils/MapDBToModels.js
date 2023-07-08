MapSongsIntoModels = ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId,
  created_at,
  updated_at,
}) => ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId,
  createdAt: created_at,
  updatedAt: updated_at,
});

MapAlbumsIntoModels = ({ id, name, year }) => ({
  id,
  name,
  year,
});

module.exports = { MapAlbumsIntoModels, MapSongsIntoModels };
