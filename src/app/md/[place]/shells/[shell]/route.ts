import { createMarkdownRouteHandler } from '@/server/utils/createMarkdownRoute';

const handler = createMarkdownRouteHandler();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ place: string; shell: string }> },
) {
  const { place, shell } = await params;
  return handler(request, `/md/${place}/shells/${shell}`);
}
