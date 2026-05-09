use std::{error::Error, fmt};

pub type AppResult<T> = Result<T, AppError>;

#[derive(Debug, Clone)]
pub struct AppError {
    message: String,
}

impl AppError {
    pub fn new(message: impl Into<String>) -> Self {
        Self {
            message: message.into(),
        }
    }
}

impl fmt::Display for AppError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}", self.message)
    }
}

impl Error for AppError {}

impl From<AppError> for String {
    fn from(value: AppError) -> Self {
        value.to_string()
    }
}
