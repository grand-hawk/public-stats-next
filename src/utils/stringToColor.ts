export function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i += 1)
    hash = str.charCodeAt(i) + ((hash << 5) - hash);

  const hue = Math.abs(hash) % 360;
  const saturation = 65;
  const lightness = 60;

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}
