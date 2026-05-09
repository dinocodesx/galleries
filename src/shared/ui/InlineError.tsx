type InlineErrorProps = {
  message: string;
};

export function InlineError({ message }: InlineErrorProps) {
  return <p className="ui-inline-error">{message}</p>;
}
