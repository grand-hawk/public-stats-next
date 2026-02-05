export type BaseVehicleImageType =
  | 'perspective'
  | 'perspective_banner'
  | 'left'
  | 'right'
  | 'front'
  | 'back'
  | 'top';
export type VehicleImageType =
  | BaseVehicleImageType
  | `${BaseVehicleImageType}_transparent`
  | 'icon';

export function getVehicleImage(
  slug: string,
  type: VehicleImageType = 'perspective',
  optimized = true,
) {
  return `https://${optimized ? 'img' : 'cdn'}.astrid.ovh/public-stats-images/${slug}/${type}.png`;
}
