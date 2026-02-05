export function relPenetration(losPenetration: number, angle: number) {
  return losPenetration * Math.cos((Math.PI / 180) * angle);
}
