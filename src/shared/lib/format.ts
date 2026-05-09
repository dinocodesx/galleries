const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

export function formatCount(value: number, singular: string, plural: string) {
  return `${value} ${value === 1 ? singular : plural}`;
}

export function formatIndexedAt(value: string) {
  return timeFormatter.format(new Date(value));
}

export function formatShotDate(timestamp: number) {
  return dateFormatter.format(new Date(timestamp));
}
