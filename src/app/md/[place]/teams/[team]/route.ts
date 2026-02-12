import { createMarkdownRouteHandler } from '@/server/utils/createMarkdownRoute';

const handler = createMarkdownRouteHandler();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ place: string; team: string }> },
) {
  const { place, team } = await params;
  return handler(request, `/md/${place}/teams/${team}`);
}
