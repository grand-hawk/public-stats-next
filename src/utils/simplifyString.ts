export function simplifyString(str: string) {
  return str
    .normalize('NFD')
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]/g, '');
}
