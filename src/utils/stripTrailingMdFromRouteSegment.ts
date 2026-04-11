export function stripTrailingMdFromRouteSegment(segment: string) {
  return segment.endsWith('.md') ? segment.slice(0, -'.md'.length) : segment;
}
