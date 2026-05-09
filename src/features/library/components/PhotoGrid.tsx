import type { PhotoRecord } from "../../../shared/types/library";
import { PhotoTile } from "./PhotoTile";
import "./PhotoGrid.css";

type PhotoGridProps = {
  photos: PhotoRecord[];
  onOpenPhoto: (photoId: number) => void;
};

export function PhotoGrid({ photos, onOpenPhoto }: PhotoGridProps) {
  return (
    <section className="photo-grid">
      {photos.map((photo) => (
        <PhotoTile key={photo.id} photo={photo} onOpenPhoto={onOpenPhoto} />
      ))}
    </section>
  );
}
