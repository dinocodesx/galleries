use tauri::{Emitter, WebviewWindow};

use crate::{
    error::{AppError, AppResult},
    models::IndexingProgress,
};

#[allow(clippy::too_many_arguments)]
pub fn indexing_progress(
    stage: &'static str,
    progress: f64,
    processed_entries: usize,
    total_entries: usize,
    folders_found: usize,
    albums_with_photos: usize,
    photos_found: usize,
    current_path: Option<String>,
) -> IndexingProgress {
    IndexingProgress {
        stage,
        progress,
        processed_entries,
        total_entries,
        folders_found,
        albums_with_photos,
        photos_found,
        current_path,
    }
}

pub fn emit_progress(window: &WebviewWindow, payload: IndexingProgress) -> AppResult<()> {
    window
        .emit("indexing-progress", payload)
        .map_err(|error| AppError::new(format!("Could not emit indexing progress: {error}")))
}
