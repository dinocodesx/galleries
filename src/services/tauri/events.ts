import { listen } from "@tauri-apps/api/event";
import type { IndexingProgress } from "../../shared/types/library";

export function listenToIndexingProgress(
  handler: (payload: IndexingProgress) => void,
) {
  return listen<IndexingProgress>("indexing-progress", (event) => {
    handler(event.payload);
  });
}
