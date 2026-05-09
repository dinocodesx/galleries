import type { LibraryOverview } from "../../../shared/types/library";
import { Button } from "../../../shared/ui/Button";
import { AlbumList } from "./AlbumList";

type SidebarProps = {
  overview: LibraryOverview;
  selectedAlbumId: number | null;
  onSelectAlbum: (albumId: number) => void;
  onReindexFolder: () => void | Promise<void>;
};

export function Sidebar({
  overview,
  selectedAlbumId,
  onSelectAlbum,
  onReindexFolder,
}: SidebarProps) {
  return (
    <aside className="library-sidebar">
      <div className="sidebar-header">
        <p className="screen-kicker">Indexed library</p>
        <h1>Galleries</h1>
        <p className="sidebar-root">{overview.rootPath}</p>
      </div>

      <div className="sidebar-actions">
        <Button block onClick={onReindexFolder}>
          Re-index folder
        </Button>
      </div>

      <div className="sidebar-stats">
        <div>
          <span>Folders</span>
          <strong>{overview.totalFolders}</strong>
        </div>
        <div>
          <span>Albums</span>
          <strong>{overview.totalAlbumsWithPhotos}</strong>
        </div>
        <div>
          <span>Photos</span>
          <strong>{overview.totalPhotos}</strong>
        </div>
      </div>

      <AlbumList
        albums={overview.albums}
        selectedAlbumId={selectedAlbumId}
        onSelectAlbum={onSelectAlbum}
      />
    </aside>
  );
}
