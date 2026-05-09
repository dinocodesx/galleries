import type { AlbumPayload, AlbumSummary, LibraryOverview } from "../../shared/types/library";
import { EmptyState } from "../../shared/ui/EmptyState";
import { InlineError } from "../../shared/ui/InlineError";
import { LoadingPanel } from "../../shared/ui/LoadingPanel";
import { AlbumHeader } from "./components/AlbumHeader";
import { PhotoGrid } from "./components/PhotoGrid";
import { Sidebar } from "./components/Sidebar";
import "./library.css";

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
  selectedAlbumId,
  selectedAlbum,
  albumPayload,
  isAlbumLoading,
  error,
  onSelectAlbum,
  onReindexFolder,
  onOpenPhoto,
}: LibraryScreenProps) {
  return (
    <div className="library-shell">
      <Sidebar
        overview={overview}
        selectedAlbumId={selectedAlbumId}
        onSelectAlbum={onSelectAlbum}
        onReindexFolder={onReindexFolder}
      />

      <main className="library-main">
        <AlbumHeader overview={overview} selectedAlbum={selectedAlbum} />

        {error ? <InlineError message={error} /> : null}

        {isAlbumLoading ? <LoadingPanel message="Loading album..." /> : null}

        {!isAlbumLoading && albumPayload && albumPayload.photos.length === 0 ? (
          <EmptyState
            title="This folder does not contain images directly."
            body="Nested folders were still indexed and are available in the sidebar."
          />
        ) : null}

        {!isAlbumLoading && albumPayload && albumPayload.photos.length > 0 ? (
          <PhotoGrid photos={albumPayload.photos} onOpenPhoto={onOpenPhoto} />
        ) : null}
      </main>
    </div>
  );
}
