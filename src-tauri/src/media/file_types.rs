use std::path::Path;

const SUPPORTED_EXTENSIONS: &[&str] = &["jpg", "jpeg", "png", "gif", "webp", "bmp", "tiff"];

pub fn is_supported_image(path: &Path) -> bool {
    path.extension()
        .and_then(|extension| extension.to_str())
        .map(|extension| {
            SUPPORTED_EXTENSIONS
                .iter()
                .any(|supported| supported.eq_ignore_ascii_case(extension))
        })
        .unwrap_or(false)
}
