use std::fs;

use rusqlite::Connection;
use tauri::{AppHandle, Manager};

use crate::error::{AppError, AppResult};

const DATABASE_FILE_NAME: &str = "gallery-index.sqlite3";

pub fn open_database(app: &AppHandle) -> AppResult<Connection> {
    let app_data_dir = app
        .path()
        .app_data_dir()
        .map_err(|error| AppError::new(format!("Could not resolve app data directory: {error}")))?;
    fs::create_dir_all(&app_data_dir).map_err(|error| {
        AppError::new(format!(
            "Could not create app data directory {}: {error}",
            app_data_dir.display()
        ))
    })?;

    let database_path = app_data_dir.join(DATABASE_FILE_NAME);
    let conn = Connection::open(database_path)
        .map_err(|error| AppError::new(format!("Could not open the SQLite database: {error}")))?;
    conn.execute_batch(
        "
        PRAGMA foreign_keys = ON;
        PRAGMA journal_mode = WAL;
        ",
    )
    .map_err(|error| AppError::new(format!("Could not initialize SQLite pragmas: {error}")))?;

    Ok(conn)
}
