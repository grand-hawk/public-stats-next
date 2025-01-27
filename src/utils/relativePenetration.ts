export default function relativePenetration(
  losPenetration: number,
  angle: number,
) {
  return losPenetration * Math.cos((Math.PI / 180) * angle);
}
