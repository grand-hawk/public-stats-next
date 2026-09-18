import React from 'react';

import { useArmorStore } from '@/stores/armor';

interface ArmorDebugBridgeOptions {
  detectedMaxDepth: number;
  onSelectVehicle: (slug: string) => void;
  onSetFrontArmorDepth: ((percent: number) => void) | null;
  slug: string | null;
  vehicles: { frontArmorDepth?: number; name: string; slug: string }[];
}

export function useArmorDebugBridge({
  detectedMaxDepth,
  onSelectVehicle,
  onSetFrontArmorDepth,
  slug,
  vehicles,
}: ArmorDebugBridgeOptions) {
  const setDetectedMaxDepth = useArmorStore((s) => s.setDetectedMaxDepth);
  const setSlug = useArmorStore((s) => s.setSlug);
  const setVehicles = useArmorStore((s) => s.setVehicles);
  const setOnSelectVehicle = useArmorStore((s) => s.setOnSelectVehicle);
  const setOnSetFrontArmorDepth = useArmorStore(
    (s) => s.setOnSetFrontArmorDepth,
  );

  React.useEffect(() => {
    setDetectedMaxDepth(detectedMaxDepth);
  }, [detectedMaxDepth, setDetectedMaxDepth]);
  React.useEffect(() => {
    setSlug(slug);
  }, [slug, setSlug]);
  React.useEffect(() => {
    setVehicles(vehicles);
  }, [vehicles, setVehicles]);
  React.useEffect(() => {
    setOnSelectVehicle(onSelectVehicle);
  }, [onSelectVehicle, setOnSelectVehicle]);
  React.useEffect(() => {
    setOnSetFrontArmorDepth(onSetFrontArmorDepth);
  }, [onSetFrontArmorDepth, setOnSetFrontArmorDepth]);
}
