import { create } from 'zustand';

interface DevelopmentStore {
  isOverlayOpen: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  setOverlayOpen: (open: boolean) => void;
  setPosition: (position: { x: number; y: number }) => void;
  setSize: (size: { width: number; height: number }) => void;
  toggleOverlay: () => void;
}

export const useDevelopmentStore = create<DevelopmentStore>()((set) => ({
  isOverlayOpen: false,
  position: { x: 100, y: 100 },
  size: { width: 400, height: 300 },
  setOverlayOpen: (open: boolean) => set({ isOverlayOpen: open }),
  setPosition: (position: { x: number; y: number }) => set({ position }),
  setSize: (size: { width: number; height: number }) => set({ size }),
  toggleOverlay: () =>
    set((state: DevelopmentStore) => ({
      isOverlayOpen: !state.isOverlayOpen,
    })),
}));
