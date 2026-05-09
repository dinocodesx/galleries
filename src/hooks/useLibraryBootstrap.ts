import { useEffect, useRef } from "react";
import { getLibraryOverview } from "../services/tauri/commands";
import type { LibraryOverview } from "../shared/types/library";

type UseLibraryBootstrapOptions = {
  onOverviewLoaded: (overview: LibraryOverview) => Promise<void> | void;
  onMissingLibrary: () => void;
  onError: (message: string) => void;
};

export function useLibraryBootstrap(options: UseLibraryBootstrapOptions) {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    let isMounted = true;

    void (async () => {
      try {
        const overview = await getLibraryOverview();
        if (!isMounted) {
          return;
        }

        if (overview) {
          await optionsRef.current.onOverviewLoaded(overview);
          return;
        }

        optionsRef.current.onMissingLibrary();
      } catch (error) {
        if (!isMounted) {
          return;
        }

        const message =
          error instanceof Error ? error.message : "Could not restore the indexed library.";
        optionsRef.current.onError(message);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);
}
