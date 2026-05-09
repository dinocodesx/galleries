import type { LibraryOverview } from "../types/library";

type SidebarProps = {
  overview: LibraryOverview;
  isLibraryView: boolean;
  onShowLibrary: () => void;
  onReindexFolder: () => void | Promise<void>;
};

export function Sidebar({
  overview,
  isLibraryView,
  onShowLibrary,
  onReindexFolder,
}: SidebarProps) {
  return (
    <aside className="library-sidebar">
      <nav className="sidebar-nav">
        {/* Library */}
        <button
          type="button"
          onClick={onShowLibrary}
          className={`sidebar-nav-item${isLibraryView ? " sidebar-nav-item--active" : ""}`}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1"/>
            <rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1"/>
            <rect x="14" y="14" width="7" height="7" rx="1"/>
          </svg>
          Albums
        </button>

        {/* Re-index folder — same shape, muted variant */}
        <button
          type="button"
          onClick={onReindexFolder}
          className="sidebar-nav-item sidebar-nav-item--action"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10"/>
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
          </svg>
          Re-index folder
        </button>
      </nav>

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
    </aside>
  );
}
