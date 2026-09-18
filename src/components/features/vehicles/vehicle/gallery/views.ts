import type { BaseVehicleImageType } from '@/utils/getVehicleImage';

export type GalleryImageType = Exclude<
  BaseVehicleImageType,
  'perspective_banner'
>;

export const IMAGE_VIEWS: { type: GalleryImageType; label: string }[] = [
  { type: 'perspective', label: 'Thumbnail' },
  { type: 'front', label: 'Front' },
  { type: 'back', label: 'Back' },
  { type: 'left', label: 'Left' },
  { type: 'right', label: 'Right' },
  { type: 'top', label: 'Top' },
];
