import type { AlbumSummary } from "../../../shared/types/library";

type AlbumListProps = {
  albums: AlbumSummary[];
  selectedAlbumId: number | null;
  onSelectAlbum: (albumId: number) => void;
};

export function AlbumList({
  albums,
  selectedAlbumId,
  onSelectAlbum,
}: AlbumListProps) {
  return (
    <div className="sidebar-list">
      {albums.map((album) => (
        <button
          key={album.id}
          className={album.id === selectedAlbumId ? "album-row active" : "album-row"}
          onClick={() => onSelectAlbum(album.id)}
          style={{ paddingLeft: `${1 + album.depth * 0.85}rem` }}
          type="button"
        >
          <span className="album-row-name">{album.name}</span>
          <small>{album.photoCount}</small>
        </button>
      ))}
    </div>
  );
}
