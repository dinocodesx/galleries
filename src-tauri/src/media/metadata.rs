use std::{fs, io::BufReader, path::Path, time::UNIX_EPOCH};

use chrono::{DateTime, NaiveDateTime, Utc};
use exif::{In, Reader, Tag, Value};

use crate::error::{AppError, AppResult};

pub fn extract_sort_timestamp(path: &Path) -> AppResult<i64> {
    if let Some(timestamp) = extract_exif_timestamp(path) {
        return Ok(timestamp);
    }

    let metadata = fs::metadata(path).map_err(|error| {
        AppError::new(format!(
            "Couldn't read metadata for {}: {error}",
            path.display()
        ))
    })?;
    let modified = metadata.modified().map_err(|error| {
        AppError::new(format!(
            "Couldn't read modification date for {}: {error}",
            path.display()
        ))
    })?;
    let duration = modified.duration_since(UNIX_EPOCH).map_err(|error| {
        AppError::new(format!(
            "Invalid modification date for {}: {error}",
            path.display()
        ))
    })?;

    Ok(duration.as_millis() as i64)
}

fn extract_exif_timestamp(path: &Path) -> Option<i64> {
    let file = fs::File::open(path).ok()?;
    let mut reader = BufReader::new(file);
    let exif = Reader::new().read_from_container(&mut reader).ok()?;

    let tags = [Tag::DateTimeOriginal, Tag::DateTimeDigitized, Tag::DateTime];

    for tag in tags {
        let field = exif.get_field(tag, In::PRIMARY)?;
        let Value::Ascii(values) = &field.value else {
            continue;
        };
        let raw_value = values.first()?;
        let candidate = String::from_utf8_lossy(raw_value)
            .trim_matches('\0')
            .trim()
            .to_string();

        if let Ok(value) = NaiveDateTime::parse_from_str(&candidate, "%Y:%m:%d %H:%M:%S") {
            let timestamp = DateTime::<Utc>::from_naive_utc_and_offset(value, Utc);
            return Some(timestamp.timestamp_millis());
        }
    }

    None
}
