import type { AlbumSummary } from "../../../shared/types/library";
import { convertFileSrc } from "@tauri-apps/api/core";
import "./AlbumGrid.css";

type AlbumGridProps = {
  albums: AlbumSummary[];
  onSelectAlbum: (albumId: number) => void;
};

export function AlbumGrid({ albums, onSelectAlbum }: AlbumGridProps) {
  const visibleAlbums = albums.filter((a) => a.photoCount > 0);

  if (visibleAlbums.length === 0) {
    return (
      <div className="album-grid-empty">
        <span className="album-grid-empty-icon">🗂️</span>
        <p>No albums found in this library.</p>
      </div>
    );
  }

  return (
    <div className="album-grid">
      {visibleAlbums.map((album) => (
        <button
          key={album.id}
          className="album-card"
          onClick={() => onSelectAlbum(album.id)}
          type="button"
          title={album.path}
        >
          <div className="album-card-cover">
            {album.coverPhotoPath ? (
              <img
                src={convertFileSrc(album.coverPhotoPath)}
                alt={album.name}
                loading="lazy"
              />
            ) : (
              <div className="album-card-placeholder">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9a2 2 0 0 1 2-2h.93a2 2 0 0 0 1.664-.89l.812-1.22A2 2 0 0 1 10.07 4h3.86a2 2 0 0 1 1.664.89l.812 1.22A2 2 0 0 0 18.07 7H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z"/>
                  <circle cx="12" cy="13" r="3"/>
                </svg>
              </div>
            )}
            <div className="album-card-overlay" />
          </div>
          <div className="album-card-info">
            <span className="album-card-name">{album.name}</span>
            <span className="album-card-count">{album.photoCount} photo{album.photoCount !== 1 ? "s" : ""}</span>
          </div>
        </button>
      ))}
    </div>
  );
}
