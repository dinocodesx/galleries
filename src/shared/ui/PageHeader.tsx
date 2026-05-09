import React from "react";

type PageHeaderProps = {
  kicker: React.ReactNode;
  title: React.ReactNode;
  meta: React.ReactNode;
};

export function PageHeader({ kicker, title, meta }: PageHeaderProps) {
  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        background: "var(--color-background)",
        paddingTop: "1.5rem",
        paddingBottom: "1rem",
        marginBottom: "1rem",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      <p
        className="screen-kicker"
        style={{
          margin: "0 0 0.35rem 0",
          color: "var(--color-text-subtle)",
          textTransform: "uppercase",
          fontSize: "0.75rem",
          letterSpacing: "0.05em",
          fontWeight: 600,
        }}
      >
        {kicker}
      </p>
      <h2
        style={{
          margin: 0,
          fontSize: "clamp(2.5rem, 4vw, 3.5rem)",
          fontWeight: 700,
          letterSpacing: "-0.04em",
          color: "var(--color-text)",
        }}
      >
        {title}
      </h2>
      <p
        style={{
          margin: "0.75rem 0 0 0",
          color: "var(--color-text-muted)",
          fontSize: "0.95rem",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
        }}
      >
        {meta}
      </p>
    </div>
  );
}
