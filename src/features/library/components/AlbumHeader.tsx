import { formatCount, formatIndexedAt } from "../../../shared/lib/format";
import type { AlbumSummary, LibraryOverview } from "../../../shared/types/library";

type AlbumHeaderProps = {
  overview: LibraryOverview;
  selectedAlbum: AlbumSummary | null;
};

export function AlbumHeader({ overview, selectedAlbum }: AlbumHeaderProps) {
  return (
    <header className="library-header">
      <div>
        <p className="screen-kicker">Album</p>
        <h2>{selectedAlbum?.name ?? "Choose an album"}</h2>
        <p className="header-subtle">
          {selectedAlbum
            ? `${formatCount(selectedAlbum.photoCount, "photo", "photos")} in ${selectedAlbum.path}`
            : "Select a folder album from the sidebar."}
        </p>
      </div>
      <div className="header-meta">
        <span>Indexed {formatIndexedAt(overview.indexedAt)}</span>
      </div>
    </header>
  );
}
