import slug from 'slug';

export function slugifyArray(array: string[]) {
  return Object.fromEntries(array.map((item) => [slug(item), item]));
}
