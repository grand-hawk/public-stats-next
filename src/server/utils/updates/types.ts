export interface UpdateMedia {
  url: string;
  mimeType: string;
  alt: string;
  width?: number;
  height?: number;
  poster?: string;
}

export interface UpdateProseBlock {
  kind: 'prose';
  text: string;
}

export interface UpdateMediaBlock {
  kind: 'media';
  media: UpdateMedia;
  caption?: string;
  loop: boolean;
}

export interface UpdateGalleryItem {
  media: UpdateMedia;
  caption?: string;
}

export interface UpdateGalleryBlock {
  kind: 'gallery';
  items: UpdateGalleryItem[];
}

export type UpdateBlock =
  UpdateProseBlock | UpdateMediaBlock | UpdateGalleryBlock;

export interface UpdateSummary {
  slug: string;
  title: string;
  date: string;
  summary?: string;
}

export interface Update extends UpdateSummary {
  blocks: UpdateBlock[];
  draft: boolean;
}

export interface UpdateView {
  update: Update;
  previous?: UpdateSummary;
  next?: UpdateSummary;
}
