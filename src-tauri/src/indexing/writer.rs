use std::{collections::{BTreeMap, HashMap}, path::Path};

use chrono::Utc;
use rusqlite::{params, Connection};

use crate::{
    error::{AppError, AppResult},
    models::{FolderAccumulator, PendingPhoto},
};

pub fn write_index_to_database(
    conn: &mut Connection,
    root_path: &Path,
    folders: BTreeMap<String, FolderAccumulator>,
    mut photos: Vec<PendingPhoto>,
) -> AppResult<()> {
    let tx = conn
        .transaction()
        .map_err(|error| AppError::new(format!("Could not start the SQLite transaction: {error}")))?;

    tx.execute("DELETE FROM photos", [])
        .map_err(|error| AppError::new(format!("Could not clear old photos: {error}")))?;
    tx.execute("DELETE FROM albums", [])
        .map_err(|error| AppError::new(format!("Could not clear old albums: {error}")))?;
    tx.execute("DELETE FROM library_meta", [])
        .map_err(|error| AppError::new(format!("Could not clear old library metadata: {error}")))?;

    let indexed_at = Utc::now().to_rfc3339();
    tx.execute(
        "INSERT INTO library_meta (key, value) VALUES (?1, ?2)",
        params!["root_path", root_path.to_string_lossy().to_string()],
    )
    .map_err(|error| AppError::new(format!("Could not store the root path: {error}")))?;
    tx.execute(
        "INSERT INTO library_meta (key, value) VALUES (?1, ?2)",
        params!["indexed_at", indexed_at],
    )
    .map_err(|error| AppError::new(format!("Could not store the indexed timestamp: {error}")))?;

    let mut ordered_folders = folders.into_values().collect::<Vec<_>>();
    ordered_folders.sort_by(|left, right| left.path.cmp(&right.path));

    let mut album_id_by_path = HashMap::<String, i64>::new();
    for folder in ordered_folders {
        tx.execute(
            "INSERT INTO albums (name, path, depth, photo_count, latest_timestamp, cover_photo_path)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
            params![
                folder.name,
                folder.path,
                folder.depth,
                folder.photo_count,
                if folder.latest_timestamp == i64::MIN {
                    0
                } else {
                    folder.latest_timestamp
                },
                folder.cover_photo_path
            ],
        )
        .map_err(|error| AppError::new(format!("Could not store an indexed folder: {error}")))?;

        album_id_by_path.insert(folder.path, tx.last_insert_rowid());
    }

    photos.sort_by(|left, right| {
        right
            .sort_timestamp
            .cmp(&left.sort_timestamp)
            .then_with(|| left.file_name.cmp(&right.file_name))
    });

    for photo in photos {
        let album_id = album_id_by_path
            .get(&photo.album_path)
            .copied()
            .ok_or_else(|| AppError::new(format!("Could not find the indexed folder for photo {}", photo.path)))?;

        tx.execute(
            "INSERT INTO photos (album_id, path, file_name, sort_timestamp)
             VALUES (?1, ?2, ?3, ?4)",
            params![album_id, photo.path, photo.file_name, photo.sort_timestamp],
        )
        .map_err(|error| AppError::new(format!("Could not store an indexed photo: {error}")))?;
    }

    tx.commit()
        .map_err(|error| AppError::new(format!("Could not commit the SQLite transaction: {error}")))?;
    Ok(())
}
