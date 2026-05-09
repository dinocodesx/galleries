use serde::Serialize;

use super::AlbumSummary;

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PhotoRecord {
    pub id: i64,
    pub album_id: i64,
    pub path: String,
    pub file_name: String,
    pub sort_timestamp: i64,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct AlbumPayload {
    pub album: AlbumSummary,
    pub photos: Vec<PhotoRecord>,
}

pub struct PendingPhoto {
    pub album_path: String,
    pub path: String,
    pub file_name: String,
    pub sort_timestamp: i64,
}
