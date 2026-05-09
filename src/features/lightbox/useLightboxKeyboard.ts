import { useEffect } from "react";

type UseLightboxKeyboardOptions = {
  activePhotoId: number | null;
  photoIds: number[];
  onClose: () => void;
  onNavigate: (photoId: number) => void;
};

export function useLightboxKeyboard({
  activePhotoId,
  photoIds,
  onClose,
  onNavigate,
}: UseLightboxKeyboardOptions) {
  useEffect(() => {
    if (activePhotoId === null) {
      return;
    }

    const activeIndex = photoIds.findIndex((photoId) => photoId === activePhotoId);
    if (activeIndex < 0) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key === "ArrowRight" && activeIndex < photoIds.length - 1) {
        onNavigate(photoIds[activeIndex + 1]);
      }

      if (event.key === "ArrowLeft" && activeIndex > 0) {
        onNavigate(photoIds[activeIndex - 1]);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activePhotoId, onClose, onNavigate, photoIds]);
}
