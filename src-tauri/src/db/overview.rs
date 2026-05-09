use rusqlite::{Connection, OptionalExtension};

use crate::{
    error::{AppError, AppResult},
    models::{AlbumSummary, LibraryOverview},
};

pub fn load_library_overview(conn: &Connection) -> AppResult<Option<LibraryOverview>> {
    let root_path = conn
        .query_row(
            "SELECT value FROM library_meta WHERE key = 'root_path'",
            [],
            |row| row.get::<_, String>(0),
        )
        .optional()
        .map_err(|error| AppError::new(format!("Could not load the root path from SQLite: {error}")))?;

    let indexed_at = conn
        .query_row(
            "SELECT value FROM library_meta WHERE key = 'indexed_at'",
            [],
            |row| row.get::<_, String>(0),
        )
        .optional()
        .map_err(|error| AppError::new(format!("Could not load the index timestamp from SQLite: {error}")))?;

    let (Some(root_path), Some(indexed_at)) = (root_path, indexed_at) else {
        return Ok(None);
    };

    let mut statement = conn
        .prepare(
            "SELECT id, name, path, depth, photo_count, latest_timestamp, cover_photo_path
             FROM albums
             ORDER BY path COLLATE NOCASE ASC",
        )
        .map_err(|error| AppError::new(format!("Could not prepare album overview query: {error}")))?;

    let album_iter = statement
        .query_map([], |row| {
            Ok(AlbumSummary {
                id: row.get(0)?,
                name: row.get(1)?,
                path: row.get(2)?,
                depth: row.get(3)?,
                photo_count: row.get(4)?,
                latest_timestamp: row.get(5)?,
                cover_photo_path: row.get(6)?,
            })
        })
        .map_err(|error| AppError::new(format!("Could not query the indexed folders: {error}")))?;

    let albums = album_iter
        .collect::<Result<Vec<_>, _>>()
        .map_err(|error| AppError::new(format!("Could not materialize the indexed folders: {error}")))?;

    let total_folders = albums.len() as i64;
    let total_albums_with_photos = albums.iter().filter(|album| album.photo_count > 0).count() as i64;
    let total_photos = conn
        .query_row("SELECT COUNT(*) FROM photos", [], |row| row.get::<_, i64>(0))
        .map_err(|error| AppError::new(format!("Could not count indexed photos: {error}")))?;

    Ok(Some(LibraryOverview {
        root_path,
        indexed_at,
        total_folders,
        total_albums_with_photos,
        total_photos,
        albums,
    }))
}
