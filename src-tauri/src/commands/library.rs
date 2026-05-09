use std::fs;

use tauri::{AppHandle, WebviewWindow};

use crate::{
    db::{
        albums::{load_album_photos as load_album_photos_query, load_album_summary},
        connection::open_database,
        overview::load_library_overview,
        schema::initialize_database,
    },
    error::{AppError, AppResult},
    indexing::{
        progress::{emit_progress, indexing_progress},
        scanner::scan_library,
        writer::write_index_to_database,
    },
    models::{AlbumPayload, LibraryOverview},
};

#[tauri::command]
pub fn index_library(
    app: AppHandle,
    window: WebviewWindow,
    root_path: String,
) -> Result<LibraryOverview, String> {
    index_library_impl(app, window, root_path).map_err(String::from)
}

#[tauri::command]
pub fn get_library_overview(app: AppHandle) -> Result<Option<LibraryOverview>, String> {
    get_library_overview_impl(app).map_err(String::from)
}

#[tauri::command]
pub fn load_album_photos(app: AppHandle, album_id: i64) -> Result<AlbumPayload, String> {
    load_album_photos_impl(app, album_id).map_err(String::from)
}

fn index_library_impl(
    app: AppHandle,
    window: WebviewWindow,
    root_path: String,
) -> AppResult<LibraryOverview> {
    let canonical_root = fs::canonicalize(&root_path)
        .map_err(|error| AppError::new(format!("Couldn't access the selected folder: {error}")))?;

    if !canonical_root.is_dir() {
        return Err(AppError::new("The selected path is not a folder."));
    }

    let scan_result = scan_library(&canonical_root, &window)?;

    emit_progress(
        &window,
        indexing_progress(
            "saving",
            0.97,
            scan_result.total_entries,
            scan_result.total_entries,
            scan_result.folder_count(),
            scan_result.albums_with_photos_count(),
            scan_result.photo_count(),
            Some(canonical_root.to_string_lossy().to_string()),
        ),
    )?;

    let mut conn = open_database(&app)?;
    initialize_database(&conn)?;
    write_index_to_database(&mut conn, &canonical_root, scan_result.folders, scan_result.photos)?;

    let overview = load_library_overview(&conn)?
        .ok_or_else(|| AppError::new("Indexing finished, but the library overview could not be loaded."))?;

    emit_progress(
        &window,
        indexing_progress(
            "complete",
            1.0,
            scan_result.total_entries,
            scan_result.total_entries,
            overview.total_folders as usize,
            overview.total_albums_with_photos as usize,
            overview.total_photos as usize,
            Some(overview.root_path.clone()),
        ),
    )?;

    Ok(overview)
}

fn get_library_overview_impl(app: AppHandle) -> AppResult<Option<LibraryOverview>> {
    let conn = open_database(&app)?;
    initialize_database(&conn)?;
    load_library_overview(&conn)
}

fn load_album_photos_impl(app: AppHandle, album_id: i64) -> AppResult<AlbumPayload> {
    let conn = open_database(&app)?;
    initialize_database(&conn)?;

    let album = load_album_summary(&conn, album_id)?
        .ok_or_else(|| AppError::new("That album no longer exists in the index."))?;
    let photos = load_album_photos_query(&conn, album_id)?;

    Ok(AlbumPayload { album, photos })
}
