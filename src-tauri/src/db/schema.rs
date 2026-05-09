use rusqlite::Connection;

use crate::error::{AppError, AppResult};

pub fn initialize_database(conn: &Connection) -> AppResult<()> {
    conn.execute_batch(
        "
        CREATE TABLE IF NOT EXISTS library_meta (
          key TEXT PRIMARY KEY,
          value TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS albums (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          path TEXT NOT NULL UNIQUE,
          depth INTEGER NOT NULL,
          photo_count INTEGER NOT NULL,
          latest_timestamp INTEGER NOT NULL,
          cover_photo_path TEXT
        );

        CREATE TABLE IF NOT EXISTS photos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          album_id INTEGER NOT NULL REFERENCES albums(id) ON DELETE CASCADE,
          path TEXT NOT NULL UNIQUE,
          file_name TEXT NOT NULL,
          sort_timestamp INTEGER NOT NULL
        );

        CREATE INDEX IF NOT EXISTS idx_albums_path ON albums(path);
        CREATE INDEX IF NOT EXISTS idx_photos_album_sort ON photos(album_id, sort_timestamp DESC);
        ",
    )
    .map_err(|error| AppError::new(format!("Could not initialize the SQLite schema: {error}")))?;

    Ok(())
}
