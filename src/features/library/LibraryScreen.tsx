import { useState } from "react";
import type { AlbumPayload, AlbumSummary, LibraryOverview } from "../../shared/types/library";
import { EmptyState } from "../../shared/ui/EmptyState";
import { InlineError } from "../../shared/ui/InlineError";
import { LoadingPanel } from "../../shared/ui/LoadingPanel";
import { AlbumGrid } from "./components/AlbumGrid";
import { PhotoGrid } from "./components/PhotoGrid";
import { Sidebar } from "../../shared/ui/Sidebar";
import "./library.css";
import { formatCount, formatIndexedAt } from "../../shared/lib/format";

type LibraryView = "library-grid" | "album";

type LibraryScreenProps = {
  overview: LibraryOverview;
  selectedAlbumId: number | null;
  selectedAlbum: AlbumSummary | null;
  albumPayload: AlbumPayload | null;
  isAlbumLoading: boolean;
  error: string | null;
  onSelectAlbum: (albumId: number) => void | Promise<void>;
  onReindexFolder: () => void | Promise<void>;
  onOpenPhoto: (photoId: number) => void;
};

export function LibraryScreen({
  overview,
  selectedAlbum,
  albumPayload,
  isAlbumLoading,
  error,
  onSelectAlbum,
  onReindexFolder,
  onOpenPhoto,
}: LibraryScreenProps) {
  const [view, setView] = useState<LibraryView>("library-grid");

  function handleSelectAlbum(albumId: number) {
    setView("album");
    onSelectAlbum(albumId);
  }

  function handleShowLibrary() {
    setView("library-grid");
  }

  return (
    <div className="library-shell">
      <Sidebar
        overview={overview}
        isLibraryView={view === "library-grid"}
        onShowLibrary={handleShowLibrary}
        onReindexFolder={onReindexFolder}
      />

      <main className="library-main">

        {/* Library Grid View — Albums */}
        {view === "library-grid" && (
          <>
            <div className="library-section-header">
              <h2 className="library-section-title">Albums</h2>
              <p className="library-section-meta">
                {overview.totalAlbumsWithPhotos} album{overview.totalAlbumsWithPhotos !== 1 ? "s" : ""}&nbsp;·&nbsp;{overview.totalPhotos} photos
              </p>
            </div>

            <div className="library-scroll-body">
              {error ? <InlineError message={error} /> : null}
              <AlbumGrid albums={overview.albums} onSelectAlbum={handleSelectAlbum} />
            </div>
          </>
        )}

        {/* Album Detail View */}
        {view === "album" && (
          <>
            <div className="library-section-header">
              <button
                type="button"
                onClick={handleShowLibrary}
                className="library-back-btn"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
                Back to Albums
              </button>
              <h2 className="library-section-title">
                {selectedAlbum?.name ?? "Choose an album"}
              </h2>
              <p className="library-section-meta">
                {selectedAlbum ? formatCount(selectedAlbum.photoCount, "photo", "photos") : "0 photos"}
                &nbsp;·&nbsp;Indexed {formatIndexedAt(overview.indexedAt)}
              </p>
            </div>

            <div className="library-scroll-body">
              {error ? <InlineError message={error} /> : null}
              {isAlbumLoading ? <LoadingPanel message="Loading album..." /> : null}

              {!isAlbumLoading && albumPayload && albumPayload.photos.length === 0 ? (
                <EmptyState
                  title="This folder does not contain images directly."
                  body="Nested folders were still indexed and are available in the library."
                />
              ) : null}

              {!isAlbumLoading && albumPayload && albumPayload.photos.length > 0 ? (
                <PhotoGrid photos={albumPayload.photos} onOpenPhoto={onOpenPhoto} />
              ) : null}
            </div>
          </>
        )}

      </main>
    </div>
  );
}
