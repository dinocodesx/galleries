use serde::Serialize;

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct IndexingProgress {
    pub stage: &'static str,
    pub progress: f64,
    pub processed_entries: usize,
    pub total_entries: usize,
    pub folders_found: usize,
    pub albums_with_photos: usize,
    pub photos_found: usize,
    pub current_path: Option<String>,
}
