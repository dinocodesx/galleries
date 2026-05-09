import { useEffect, useState } from "react";
import { listenToIndexingProgress } from "../../services/tauri/events";
import type { IndexingProgress } from "../../shared/types/library";

const defaultProgress: IndexingProgress = {
  stage: "counting",
  progress: 0,
  processedEntries: 0,
  totalEntries: 0,
  foldersFound: 0,
  albumsWithPhotos: 0,
  photosFound: 0,
  currentPath: null,
};

export function useIndexingProgress() {
  const [progress, setProgress] = useState<IndexingProgress>(defaultProgress);

  useEffect(() => {
    let unlisten: (() => void) | undefined;

    void listenToIndexingProgress((nextProgress) => {
      setProgress(nextProgress);
    }).then((cleanup) => {
      unlisten = cleanup;
    });

    return () => {
      unlisten?.();
    };
  }, []);

  function resetProgress(rootPath: string) {
    setProgress({
      ...defaultProgress,
      currentPath: rootPath,
    });
  }

  return {
    progress,
    resetProgress,
  };
}
