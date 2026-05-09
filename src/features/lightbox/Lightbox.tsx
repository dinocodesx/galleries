import { buildAssetUrl } from "../../services/tauri/assets";
import { formatShotDate } from "../../shared/lib/format";
import type { PhotoRecord } from "../../shared/types/library";
import "./lightbox.css";

type LightboxProps = {
  photo: PhotoRecord;
  photoIndex: number;
  photoCount: number;
  albumPath: string | null;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
};

export function Lightbox({
  photo,
  photoIndex,
  photoCount,
  albumPath,
  onClose,
  onPrevious,
  onNext,
}: LightboxProps) {
  return (
    <div aria-modal="true" className="lightbox" onClick={onClose} role="dialog">
      <button className="lightbox-close" onClick={onClose} type="button">
        Close
      </button>

      {photoIndex > 0 ? (
        <button
          className="lightbox-nav previous"
          onClick={(event) => {
            event.stopPropagation();
            onPrevious();
          }}
          type="button"
        >
          Prev
        </button>
      ) : null}

      <div className="lightbox-stage" onClick={(event) => event.stopPropagation()}>
        <img alt={photo.fileName} src={buildAssetUrl(photo.path) ?? ""} />
        <div className="lightbox-caption">
          <div>
            <h3>{photo.fileName}</h3>
            <p>{albumPath}</p>
          </div>
          <span>{formatShotDate(photo.sortTimestamp)}</span>
        </div>
      </div>

      {photoIndex < photoCount - 1 ? (
        <button
          className="lightbox-nav next"
          onClick={(event) => {
            event.stopPropagation();
            onNext();
          }}
          type="button"
        >
          Next
        </button>
      ) : null}
    </div>
  );
}
