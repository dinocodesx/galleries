import { Button } from "../../shared/ui/Button";
import { InlineError } from "../../shared/ui/InlineError";
import "./welcome.css";

type WelcomeScreenProps = {
  error: string | null;
  onChooseFolder: () => void | Promise<void>;
};

export function WelcomeScreen({ error, onChooseFolder }: WelcomeScreenProps) {
  return (
    <main className="welcome-shell">
      <section className="welcome-card">
        <p className="screen-kicker">Galleries</p>
        <h1>Index one folder and browse it like a proper photo library.</h1>
        <p className="screen-lede">
          We&apos;ll scan every nested folder, store the album structure in SQLite, and then load
          one album at a time so the app stays predictable and fast.
        </p>
        <div className="welcome-actions">
          <Button onClick={onChooseFolder}>Choose folder</Button>
        </div>
        <div className="welcome-notes">
          <span>Recursive indexing</span>
          <span>SQLite-backed albums</span>
          <span>Album-at-a-time gallery</span>
        </div>
        {error ? <InlineError message={error} /> : null}
      </section>
    </main>
  );
}
