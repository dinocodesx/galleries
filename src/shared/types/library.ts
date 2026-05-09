export type AlbumSummary = {
  id: number;
  name: string;
  path: string;
  depth: number;
  photoCount: number;
  latestTimestamp: number;
  coverPhotoPath: string | null;
};

export type PhotoRecord = {
  id: number;
  albumId: number;
  path: string;
  fileName: string;
  sortTimestamp: number;
};

export type LibraryOverview = {
  rootPath: string;
  indexedAt: string;
  totalFolders: number;
  totalAlbumsWithPhotos: number;
  totalPhotos: number;
  albums: AlbumSummary[];
};

export type AlbumPayload = {
  album: AlbumSummary;
  photos: PhotoRecord[];
};

export type IndexingProgress = {
  stage: "counting" | "scanning" | "saving" | "complete";
  progress: number;
  processedEntries: number;
  totalEntries: number;
  foldersFound: number;
  albumsWithPhotos: number;
  photosFound: number;
  currentPath: string | null;
};
