import { useMemo, useState } from "react";
import { useIndexingProgress } from "../features/indexing/useIndexingProgress";
import { useLibraryBootstrap } from "./useLibraryBootstrap";
import { useLightboxKeyboard } from "../features/lightbox/useLightboxKeyboard";
import { indexLibrary, loadAlbumPhotos } from "../services/tauri/commands";
import { chooseRootFolder } from "../services/tauri/dialogs";
import type {
  AlbumPayload,
  AlbumSummary,
  LibraryOverview,
  PhotoRecord,
} from "../shared/types/library";

export type AppPhase = "welcome" | "indexing" | "library";

export function useAppController() {
  const [appPhase, setAppPhase] = useState<AppPhase>("welcome");
  const [libraryOverview, setLibraryOverview] = useState<LibraryOverview | null>(null);
  const [selectedAlbumId, setSelectedAlbumId] = useState<number | null>(null);
  const [selectedAlbumPayload, setSelectedAlbumPayload] = useState<AlbumPayload | null>(null);
  const [activeLightboxPhotoId, setActiveLightboxPhotoId] = useState<number | null>(null);
  const [isAlbumLoading, setIsAlbumLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { progress, resetProgress } = useIndexingProgress();

  const selectedAlbum = useMemo<AlbumSummary | null>(
    () => libraryOverview?.albums.find((album) => album.id === selectedAlbumId) ?? null,
    [libraryOverview, selectedAlbumId],
  );

  const currentAlbumPhotos = useMemo<PhotoRecord[]>(
    () => selectedAlbumPayload?.photos ?? [],
    [selectedAlbumPayload],
  );

  const activeLightboxPhotoIndex = useMemo(
    () => currentAlbumPhotos.findIndex((photo) => photo.id === activeLightboxPhotoId),
    [activeLightboxPhotoId, currentAlbumPhotos],
  );

  const activeLightboxPhoto =
    activeLightboxPhotoIndex >= 0 ? currentAlbumPhotos[activeLightboxPhotoIndex] : null;

  async function handleLoadAlbum(albumId: number) {
    setIsAlbumLoading(true);
    setErrorMessage(null);

    try {
      const payload = await loadAlbumPhotos(albumId);
      setSelectedAlbumPayload(payload);
      setSelectedAlbumId(albumId);
      setActiveLightboxPhotoId(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not load that album.";
      setErrorMessage(message);
    } finally {
      setIsAlbumLoading(false);
    }
  }

  async function syncOverviewAndAlbum(nextOverview?: LibraryOverview | null) {
    const resolvedOverview = nextOverview ?? null;
    if (!resolvedOverview) {
      setLibraryOverview(null);
      setSelectedAlbumId(null);
      setSelectedAlbumPayload(null);
      setActiveLightboxPhotoId(null);
      setAppPhase("welcome");
      return;
    }

    setLibraryOverview(resolvedOverview);
    setAppPhase("library");

    const preferredAlbum =
      resolvedOverview.albums.find((album) => album.photoCount > 0) ?? resolvedOverview.albums[0];

    if (preferredAlbum) {
      await handleLoadAlbum(preferredAlbum.id);
      return;
    }

    setSelectedAlbumId(null);
    setSelectedAlbumPayload(null);
  }

  async function handleStartIndexing(rootPath: string) {
    setErrorMessage(null);
    setAppPhase("indexing");
    setSelectedAlbumId(null);
    setSelectedAlbumPayload(null);
    setActiveLightboxPhotoId(null);
    resetProgress(rootPath);

    try {
      const nextOverview = await indexLibrary(rootPath);
      await syncOverviewAndAlbum(nextOverview);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Indexing failed for that folder.";
      setErrorMessage(message);
      setAppPhase("welcome");
    }
  }

  async function handleChooseFolder() {
    const rootPath = await chooseRootFolder();
    if (!rootPath) {
      return;
    }
    await handleStartIndexing(rootPath);
  }

  useLibraryBootstrap({
    onOverviewLoaded: syncOverviewAndAlbum,
    onMissingLibrary: () => {
      setAppPhase("welcome");
      setLibraryOverview(null);
      setSelectedAlbumId(null);
      setSelectedAlbumPayload(null);
    },
    onError: (message) => {
      setErrorMessage(message);
      setAppPhase("welcome");
    },
  });

  useLightboxKeyboard({
    activePhotoId: activeLightboxPhotoId,
    photoIds: currentAlbumPhotos.map((photo) => photo.id),
    onClose: () => setActiveLightboxPhotoId(null),
    onNavigate: setActiveLightboxPhotoId,
  });

  return {
    appPhase,
    libraryOverview,
    selectedAlbum,
    selectedAlbumId,
    selectedAlbumPayload,
    activeLightboxPhoto,
    activeLightboxPhotoIndex,
    currentAlbumPhotos,
    isAlbumLoading,
    errorMessage,
    progress,
    onChooseFolder: handleChooseFolder,
    onSelectAlbum: handleLoadAlbum,
    onOpenPhoto: setActiveLightboxPhotoId,
    onClosePhoto: () => setActiveLightboxPhotoId(null),
  };
}
