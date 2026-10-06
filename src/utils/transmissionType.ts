import type { VehiclesPlaceDataVehicleDriveDataMetrics } from '@generated/vehicles';

type TransmissionType =
  VehiclesPlaceDataVehicleDriveDataMetrics['driveline']['transmissionType'];

export const TRANSMISSION_TYPE_LABELS: Record<TransmissionType, string> = {
  manual: 'Manual',
  automatedManual: 'Automated manual',
  torqueConverter: 'Torque converter automatic',
  cvt: 'CVT',
  hydromechanical: 'Hydromechanical',
  electric: 'Electric',
};
