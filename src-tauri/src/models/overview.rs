use serde::Serialize;

use super::AlbumSummary;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct LibraryOverview {
    pub root_path: String,
    pub indexed_at: String,
    pub total_folders: i64,
    pub total_albums_with_photos: i64,
    pub total_photos: i64,
    pub albums: Vec<AlbumSummary>,
}
