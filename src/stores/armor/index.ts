import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import type { ArmorAngle } from '@/utils/getVehicleImage';

interface ArmorStore {
  tourSeen: boolean;
  setTourSeen(seen: boolean): void;

  angle: ArmorAngle;
  setAngle(angle: ArmorAngle): void;

  detectedMaxDepth: number;
  setDetectedMaxDepth(v: number): void;

  maxDepth: number;
  setMaxDepth(v: number): void;

  minDepth: number;
  setMinDepth(v: number): void;

  slug: string | null;
  setSlug(slug: string | null): void;

  vehicles: Array<{
    name: string;
    slug: string;
  }>;
  setVehicles(
    vehicles: Array<{
      name: string;
      slug: string;
    }>,
  ): void;

  onSelectVehicle: ((slug: string) => void) | null;
  setOnSelectVehicle(fn: ((slug: string) => void) | null): void;

  onSetFrontArmorDepth: ((percentage: number) => void) | null;
  setOnSetFrontArmorDepth(fn: ((percentage: number) => void) | null): void;
}

export const useArmorStore = create<ArmorStore>()(
  persist(
    immer((set) => ({
      tourSeen: false,
      angle: 'front' as ArmorAngle,
      detectedMaxDepth: 0,
      maxDepth: Infinity,
      minDepth: 0,
      slug: null,
      vehicles: [],
      onSelectVehicle: null,
      onSetFrontArmorDepth: null,

      setTourSeen(seen) {
        set((s) => {
          s.tourSeen = seen;
        });
      },
      setAngle(angle) {
        set((s) => {
          s.angle = angle;
        });
      },
      setDetectedMaxDepth(v) {
        set((s) => {
          s.detectedMaxDepth = v;
        });
      },
      setMaxDepth(v) {
        set((s) => {
          s.maxDepth = v;
        });
      },
      setMinDepth(v) {
        set((s) => {
          s.minDepth = v;
        });
      },
      setSlug(slug) {
        set((s) => {
          s.slug = slug;
        });
      },
      setVehicles(vehicles) {
        set((s) => {
          s.vehicles = vehicles;
        });
      },
      setOnSelectVehicle(fn) {
        set((s) => {
          s.onSelectVehicle = fn;
        });
      },
      setOnSetFrontArmorDepth(fn) {
        set((s) => {
          s.onSetFrontArmorDepth = fn;
        });
      },
    })),
    {
      name: 'armor',
      partialize: (s) => ({ tourSeen: s.tourSeen }),
    },
  ),
);
