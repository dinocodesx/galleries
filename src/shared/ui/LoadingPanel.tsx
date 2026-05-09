type LoadingPanelProps = {
  message: string;
};

export function LoadingPanel({ message }: LoadingPanelProps) {
  return (
    <section className="ui-loading-panel">
      <div className="ui-spinner" aria-hidden="true" />
      <p>{message}</p>
    </section>
  );
}
