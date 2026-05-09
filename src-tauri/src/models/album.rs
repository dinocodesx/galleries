use serde::Serialize;

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct AlbumSummary {
    pub id: i64,
    pub name: String,
    pub path: String,
    pub depth: i64,
    pub photo_count: i64,
    pub latest_timestamp: i64,
    pub cover_photo_path: Option<String>,
}

#[derive(Clone)]
pub struct FolderAccumulator {
    pub path: String,
    pub name: String,
    pub depth: i64,
    pub photo_count: i64,
    pub latest_timestamp: i64,
    pub cover_photo_path: Option<String>,
}
