import { createMarkdownRouteHandler } from '@/server/utils/createMarkdownRoute';

const handler = createMarkdownRouteHandler();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ place: string; vehicle: string }> },
) {
  const { place, vehicle } = await params;
  return handler(request, `/md/${place}/vehicles/${vehicle}`);
}
