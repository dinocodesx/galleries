import type { IndexingProgress } from "../../shared/types/library";
import { InlineError } from "../../shared/ui/InlineError";
import "./indexing.css";

type IndexingScreenProps = {
  progress: IndexingProgress;
  error: string | null;
};

export function IndexingScreen({ progress, error }: IndexingScreenProps) {
  const percent = Math.round(progress.progress * 100);

  return (
    <main className="indexing-shell">
      <section className="indexing-card">
        <p className="screen-kicker">Indexing library</p>
        <h1>Building your folder albums</h1>
        <p className="screen-lede">
          {progress.stage === "counting"
            ? "Counting files and folders first so progress feels honest."
            : progress.stage === "scanning"
              ? "Scanning nested folders and mapping photos into albums."
              : progress.stage === "saving"
                ? "Saving the indexed structure into SQLite."
                : "Finalizing your library."}
        </p>

        <div className="progress-track" aria-hidden="true">
          <div className="progress-bar" style={{ width: `${percent}%` }} />
        </div>

        <div className="progress-meta">
          <strong>{percent}%</strong>
          <span>
            {progress.processedEntries} / {progress.totalEntries || "?"} entries
          </span>
        </div>

        <div className="indexing-stats">
          <div>
            <span>Folders</span>
            <strong>{progress.foldersFound}</strong>
          </div>
          <div>
            <span>Albums with photos</span>
            <strong>{progress.albumsWithPhotos}</strong>
          </div>
          <div>
            <span>Photos</span>
            <strong>{progress.photosFound}</strong>
          </div>
        </div>

        <p className="current-path">{progress.currentPath ?? "Preparing scan..."}</p>
        {error ? <InlineError message={error} /> : null}
      </section>
    </main>
  );
}
