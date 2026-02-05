import { createMarkdownRoute } from '@/server/utils/createMarkdownRoute';

export const getServerSideProps = createMarkdownRoute();

export default function Shell() {
  return null;
}
