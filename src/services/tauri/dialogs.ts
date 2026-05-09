import { open } from "@tauri-apps/plugin-dialog";

export async function chooseRootFolder() {
  const selection = await open({
    directory: true,
    multiple: false,
    title: "Choose a folder to index",
  });

  return typeof selection === "string" ? selection : null;
}
