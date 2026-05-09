use rusqlite::{Connection, OptionalExtension};

use crate::{
    error::{AppError, AppResult},
    models::{AlbumSummary, PhotoRecord},
};

pub fn load_album_summary(conn: &Connection, album_id: i64) -> AppResult<Option<AlbumSummary>> {
    conn.query_row(
        "SELECT id, name, path, depth, photo_count, latest_timestamp, cover_photo_path
         FROM albums
         WHERE id = ?1",
        [album_id],
        |row| {
            Ok(AlbumSummary {
                id: row.get(0)?,
                name: row.get(1)?,
                path: row.get(2)?,
                depth: row.get(3)?,
                photo_count: row.get(4)?,
                latest_timestamp: row.get(5)?,
                cover_photo_path: row.get(6)?,
            })
        },
    )
    .optional()
    .map_err(|error| AppError::new(format!("Could not load album metadata: {error}")))
}

pub fn load_album_photos(conn: &Connection, album_id: i64) -> AppResult<Vec<PhotoRecord>> {
    let mut statement = conn
        .prepare(
            "SELECT id, album_id, path, file_name, sort_timestamp
             FROM photos
             WHERE album_id = ?1
             ORDER BY sort_timestamp DESC, file_name COLLATE NOCASE ASC",
        )
        .map_err(|error| AppError::new(format!("Could not prepare album photo query: {error}")))?;

    let photo_iter = statement
        .query_map([album_id], |row| {
            Ok(PhotoRecord {
                id: row.get(0)?,
                album_id: row.get(1)?,
                path: row.get(2)?,
                file_name: row.get(3)?,
                sort_timestamp: row.get(4)?,
            })
        })
        .map_err(|error| AppError::new(format!("Could not load album photos: {error}")))?;

    photo_iter
        .collect::<Result<Vec<_>, _>>()
        .map_err(|error| AppError::new(format!("Could not materialize album photos: {error}")))
}
