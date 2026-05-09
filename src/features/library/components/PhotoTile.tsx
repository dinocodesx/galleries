import { buildAssetUrl } from "../../../services/tauri/assets";
import { formatShotDate } from "../../../shared/lib/format";
import type { PhotoRecord } from "../../../shared/types/library";

type PhotoTileProps = {
  photo: PhotoRecord;
  onOpenPhoto: (photoId: number) => void;
};

export function PhotoTile({ photo, onOpenPhoto }: PhotoTileProps) {
  return (
    <button className="photo-tile" onClick={() => onOpenPhoto(photo.id)} type="button">
      <img alt={photo.fileName} loading="lazy" src={buildAssetUrl(photo.path) ?? ""} />
      <div className="photo-meta">
        <span>{photo.fileName}</span>
        <small>{formatShotDate(photo.sortTimestamp)}</small>
      </div>
    </button>
  );
}
