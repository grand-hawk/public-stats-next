const WIKILINK = /\[\[(\/[^\s\]]+)(?:\s+([^\]\n]+))?\]\]/g;

export function applyWikilinks(body: string, initials: string): string {
  return body.replace(WIKILINK, (_match, rawPath, rawLabel) => {
    const path = String(rawPath);
    const label = rawLabel ? String(rawLabel).trim() : path;
    return `[${label}](/${initials}${path})`;
  });
}

export interface WikilinkRef {
  path: string;
  label: string;
}

export function extractWikilinkRefs(body: string): WikilinkRef[] {
  const refs: WikilinkRef[] = [];
  const seen = new Set<string>();

  for (const match of body.matchAll(WIKILINK)) {
    const path = String(match[1]);
    if (seen.has(path)) continue;
    seen.add(path);
    const label = match[2] ? String(match[2]).trim() : path;
    refs.push({ path, label });
  }

  return refs;
}
