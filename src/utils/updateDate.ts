const FORMAT = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  timeZone: 'UTC',
  year: 'numeric',
});

export function formatUpdateDate(value: string): string {
  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? '' : FORMAT.format(date);
}

export const updatePageTitle = (title: string) => `Update: ${title}`;

export function updateDateLabel({
  date,
  title,
}: {
  date: string;
  title: string;
}): string {
  const label = formatUpdateDate(date);

  return label === title ? '' : label;
}
