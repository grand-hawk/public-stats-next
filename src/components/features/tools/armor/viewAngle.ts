import type { ArmorAngle } from '@/utils/getVehicleImage';

export function getViewAngleRad(angle: ArmorAngle): number {
  switch (angle) {
    case 'front_-30':
      return (30 * Math.PI) / 180;
    case 'front_30':
      return (-30 * Math.PI) / 180;
    case 'left':
      return (-90 * Math.PI) / 180;
    case 'right':
      return (90 * Math.PI) / 180;
    case 'back':
      return Math.PI;
    default:
      return 0;
  }
}
