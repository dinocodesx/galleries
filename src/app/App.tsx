import { useMemo, useState } from "react";
import { IndexingScreen } from "../features/indexing/IndexingScreen";
import { LibraryScreen } from "../features/library/LibraryScreen";
import { Lightbox } from "../features/lightbox/Lightbox";
import { WelcomeScreen } from "../features/welcome/WelcomeScreen";
import { useIndexingProgress } from "../hooks/useIndexingProgress";
import { useLibraryBootstrap } from "../hooks/useLibraryBootstrap";
import { useLightboxKeyboard } from "../hooks/useLightboxKeyboard";
import { indexLibrary, loadAlbumPhotos } from "../services/tauri/commands";
import { chooseRootFolder } from "../services/tauri/dialogs";
import type {
  AlbumPayload,
  AlbumSummary,
  LibraryOverview,
  PhotoRecord,
} from "../shared/types/library";

type AppPhase = "welcome" | "indexing" | "library";

function App() {
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

  if (appPhase === "welcome") {
    return <WelcomeScreen error={errorMessage} onChooseFolder={handleChooseFolder} />;
  }

  if (appPhase === "indexing") {
    return <IndexingScreen error={errorMessage} progress={progress} />;
  }

  if (!libraryOverview) {
    return <WelcomeScreen error={errorMessage} onChooseFolder={handleChooseFolder} />;
  }

  return (
    <>
      <LibraryScreen
        albumPayload={selectedAlbumPayload}
        error={errorMessage}
        isAlbumLoading={isAlbumLoading}
        onOpenPhoto={setActiveLightboxPhotoId}
        onReindexFolder={handleChooseFolder}
        onSelectAlbum={handleLoadAlbum}
        overview={libraryOverview}
        selectedAlbum={selectedAlbum}
        selectedAlbumId={selectedAlbumId}
      />

      {activeLightboxPhoto ? (
        <Lightbox
          albumPath={selectedAlbum?.path ?? null}
          onClose={() => setActiveLightboxPhotoId(null)}
          onNext={() => setActiveLightboxPhotoId(currentAlbumPhotos[activeLightboxPhotoIndex + 1].id)}
          onPrevious={() => setActiveLightboxPhotoId(currentAlbumPhotos[activeLightboxPhotoIndex - 1].id)}
          photo={activeLightboxPhoto}
          photoCount={currentAlbumPhotos.length}
          photoIndex={activeLightboxPhotoIndex}
        />
      ) : null}
    </>
  );
}

export default App;
