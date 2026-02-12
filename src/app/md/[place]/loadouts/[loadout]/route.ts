import { createMarkdownRouteHandler } from '@/server/utils/createMarkdownRoute';

const handler = createMarkdownRouteHandler();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ loadout: string; place: string }> },
) {
  const { loadout, place } = await params;
  return handler(request, `/md/${place}/loadouts/${loadout}`);
}
