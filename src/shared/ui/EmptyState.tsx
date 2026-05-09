import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  body: string;
  children?: ReactNode;
};

export function EmptyState({ title, body, children }: EmptyStateProps) {
  return (
    <section className="ui-empty-state">
      <h3>{title}</h3>
      <p>{body}</p>
      {children}
    </section>
  );
}
