import { buildAssetUrl } from "../../services/tauri/assets";
import { formatShotDate } from "../../shared/lib/format";
import type { PhotoRecord } from "../../shared/types/library";
import "./lightbox.css";

type LightboxProps = {
  photo: PhotoRecord;
  photoIndex: number;
  photoCount: number;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
};

export function Lightbox({
  photo,
  photoIndex,
  photoCount,
  onClose,
  onPrevious,
  onNext,
}: LightboxProps) {
  return (
    <div aria-modal="true" className="lightbox" onClick={onClose} role="dialog">
      <button className="lightbox-icon-btn lightbox-close" onClick={onClose} type="button" aria-label="Close">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      {photoIndex > 0 ? (
        <button
          className="lightbox-icon-btn lightbox-nav previous"
          onClick={(event) => {
            event.stopPropagation();
            onPrevious();
          }}
          type="button"
          aria-label="Previous"
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
      ) : null}

      <div className="lightbox-stage" onClick={(event) => event.stopPropagation()}>
        <img alt={photo.fileName} src={buildAssetUrl(photo.path) ?? ""} />
      </div>

      {photoIndex < photoCount - 1 ? (
        <button
          className="lightbox-icon-btn lightbox-nav next"
          onClick={(event) => {
            event.stopPropagation();
            onNext();
          }}
          type="button"
          aria-label="Next"
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      ) : null}

      <div className="lightbox-topbar" onClick={(event) => event.stopPropagation()}>
         <span className="lightbox-topbar-filename">{photo.fileName}</span>
         <span className="lightbox-topbar-sep">•</span>
         <span className="lightbox-topbar-date">{formatShotDate(photo.sortTimestamp)}</span>
      </div>
    </div>
  );
}
