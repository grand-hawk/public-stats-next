export type BaseVehicleImageType =
  | 'perspective'
  | 'perspective_banner'
  | 'left'
  | 'right'
  | 'front'
  | 'back'
  | 'top';
export type ArmorAngle = 'left' | 'right' | 'front' | 'back';
export type ArmorImageType = `${ArmorAngle}_armor`;
export type VehicleImageType =
  | BaseVehicleImageType
  | `${BaseVehicleImageType}_transparent`
  | ArmorImageType
  | 'icon';

export function getVehicleImage(
  slug: string,
  type: VehicleImageType = 'perspective',
  optimized = true,
) {
  return `https://${optimized ? 'img' : 'cdn'}.astrid.ovh/public-stats-images/${slug}/${type}.png`;
}
