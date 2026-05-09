import { invoke } from "@tauri-apps/api/core";
import type { AlbumPayload, LibraryOverview } from "../../shared/types/library";

export function indexLibrary(rootPath: string) {
  return invoke<LibraryOverview>("index_library", { rootPath });
}

export function getLibraryOverview() {
  return invoke<LibraryOverview | null>("get_library_overview");
}

export function loadAlbumPhotos(albumId: number) {
  return invoke<AlbumPayload>("load_album_photos", { albumId });
}
