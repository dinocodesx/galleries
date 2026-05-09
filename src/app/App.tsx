import { IndexingScreen } from "../features/indexing/IndexingScreen";
import { LibraryScreen } from "../features/library/LibraryScreen";
import { Lightbox } from "../features/lightbox/Lightbox";
import { WelcomeScreen } from "../features/welcome/WelcomeScreen";
import { useAppController } from "./useAppController";

function App() {
  const {
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
    onChooseFolder,
    onSelectAlbum,
    onOpenPhoto,
    onClosePhoto,
  } = useAppController();

  if (appPhase === "welcome") {
    return <WelcomeScreen error={errorMessage} onChooseFolder={onChooseFolder} />;
  }

  if (appPhase === "indexing") {
    return <IndexingScreen error={errorMessage} progress={progress} />;
  }

  if (!libraryOverview) {
    return <WelcomeScreen error={errorMessage} onChooseFolder={onChooseFolder} />;
  }

  return (
    <>
      <LibraryScreen
        albumPayload={selectedAlbumPayload}
        error={errorMessage}
        isAlbumLoading={isAlbumLoading}
        onOpenPhoto={onOpenPhoto}
        onReindexFolder={onChooseFolder}
        onSelectAlbum={onSelectAlbum}
        overview={libraryOverview}
        selectedAlbum={selectedAlbum}
        selectedAlbumId={selectedAlbumId}
      />

      {activeLightboxPhoto ? (
        <Lightbox
          onClose={onClosePhoto}
          onNext={() =>
            onOpenPhoto(currentAlbumPhotos[activeLightboxPhotoIndex + 1].id)
          }
          onPrevious={() =>
            onOpenPhoto(currentAlbumPhotos[activeLightboxPhotoIndex - 1].id)
          }
          photo={activeLightboxPhoto}
          photoCount={currentAlbumPhotos.length}
          photoIndex={activeLightboxPhotoIndex}
        />
      ) : null}
    </>
  );
}

export default App;
