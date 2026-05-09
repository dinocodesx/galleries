mod commands;
mod db;
mod error;
mod indexing;
mod media;
mod models;

use commands::{get_library_overview, index_library, load_album_photos};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            index_library,
            get_library_overview,
            load_album_photos
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
