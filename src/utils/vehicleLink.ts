export const VEHICLE_HREF = 'vehicle:';

export const normaliseTarget = (target: string): string => {
  const trimmed = target.trim();

  try {
    return decodeURIComponent(trimmed).toLowerCase();
  } catch {
    return trimmed.toLowerCase();
  }
};
