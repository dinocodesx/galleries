import { convertFileSrc } from "@tauri-apps/api/core";

export function buildAssetUrl(path: string | null) {
  return path ? convertFileSrc(path) : null;
}
