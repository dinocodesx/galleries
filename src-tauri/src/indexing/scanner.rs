use std::{collections::BTreeMap, path::Path};

use tauri::WebviewWindow;
use walkdir::WalkDir;

use crate::{
    error::AppResult,
    indexing::progress::{emit_progress, indexing_progress},
    media::{file_types::is_supported_image, metadata::extract_sort_timestamp},
    models::{FolderAccumulator, PendingPhoto},
};

pub struct ScanResult {
    pub total_entries: usize,
    pub folders: BTreeMap<String, FolderAccumulator>,
    pub photos: Vec<PendingPhoto>,
}

impl ScanResult {
    pub fn folder_count(&self) -> usize {
        self.folders.len()
    }

    pub fn albums_with_photos_count(&self) -> usize {
        self.folders
            .values()
            .filter(|folder| folder.photo_count > 0)
            .count()
    }

    pub fn photo_count(&self) -> usize {
        self.photos.len()
    }
}

pub fn scan_library(root_path: &Path, window: &WebviewWindow) -> AppResult<ScanResult> {
    emit_progress(
        window,
        indexing_progress(
            "counting",
            0.0,
            0,
            0,
            0,
            0,
            0,
            Some(root_path.to_string_lossy().to_string()),
        ),
    )?;

    let total_entries = WalkDir::new(root_path)
        .follow_links(true)
        .into_iter()
        .filter_map(Result::ok)
        .count();

    let root_key = root_path.to_string_lossy().into_owned();
    let root_name = root_path
        .file_name()
        .map(|segment| segment.to_string_lossy().into_owned())
        .unwrap_or_else(|| "Library Root".to_string());

    let mut folders = BTreeMap::<String, FolderAccumulator>::new();
    folders.insert(
        root_key.clone(),
        FolderAccumulator {
            path: root_key.clone(),
            name: root_name,
            depth: 0,
            photo_count: 0,
            latest_timestamp: i64::MIN,
            cover_photo_path: None,
        },
    );

    let mut photos = Vec::<PendingPhoto>::new();
    let mut processed_entries = 0usize;

    for entry in WalkDir::new(root_path)
        .follow_links(true)
        .into_iter()
        .filter_map(Result::ok)
    {
        processed_entries += 1;
        let path = entry.path().to_path_buf();
        let path_string = path.to_string_lossy().into_owned();

        if entry.file_type().is_dir() {
            if !folders.contains_key(&path_string) {
                folders.insert(
                    path_string.clone(),
                    FolderAccumulator {
                        name: path_name_or_default(&path, "Untitled Folder"),
                        depth: relative_depth(root_path, &path),
                        path: path_string.clone(),
                        photo_count: 0,
                        latest_timestamp: i64::MIN,
                        cover_photo_path: None,
                    },
                );
            }
        } else if entry.file_type().is_file() && is_supported_image(&path) {
            let album_path = path.parent().unwrap_or(root_path);
            let album_key = album_path.to_string_lossy().into_owned();
            let sort_timestamp = extract_sort_timestamp(&path)?;

            if !folders.contains_key(&album_key) {
                folders.insert(
                    album_key.clone(),
                    FolderAccumulator {
                        name: path_name_or_default(album_path, "Untitled Folder"),
                        depth: relative_depth(root_path, album_path),
                        path: album_key.clone(),
                        photo_count: 0,
                        latest_timestamp: i64::MIN,
                        cover_photo_path: None,
                    },
                );
            }

            let folder_entry = folders.get_mut(&album_key).unwrap();
            folder_entry.photo_count += 1;
            if sort_timestamp >= folder_entry.latest_timestamp {
                folder_entry.latest_timestamp = sort_timestamp;
                folder_entry.cover_photo_path = Some(path_string.clone());
            }

            photos.push(PendingPhoto {
                album_path: album_key,
                path: path_string.clone(),
                file_name: path_name_or_default(&path, "Untitled"),
                sort_timestamp,
            });
        }

        if processed_entries.is_multiple_of(25) || processed_entries == total_entries {
            emit_progress(
                window,
                indexing_progress(
                    "scanning",
                    processed_entries as f64 / total_entries.max(1) as f64,
                    processed_entries,
                    total_entries,
                    folders.len(),
                    folders.values().filter(|folder| folder.photo_count > 0).count(),
                    photos.len(),
                    Some(path_string),
                ),
            )?;
        }
    }

    Ok(ScanResult {
        total_entries,
        folders,
        photos,
    })
}

fn path_name_or_default(path: &Path, fallback: &str) -> String {
    path.file_name()
        .map(|segment| segment.to_string_lossy().into_owned())
        .unwrap_or_else(|| fallback.to_string())
}

fn relative_depth(root: &Path, candidate: &Path) -> i64 {
    candidate
        .strip_prefix(root)
        .map(|relative| relative.components().count() as i64)
        .unwrap_or(0)
}
