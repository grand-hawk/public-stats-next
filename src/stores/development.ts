import { create } from 'zustand';

interface DevelopmentStore {
  isOverlayOpen: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  debugData: Record<string, unknown>;
  highlightedModule: string | null;
  setOverlayOpen: (open: boolean) => void;
  setPosition: (position: { x: number; y: number }) => void;
  setSize: (size: { width: number; height: number }) => void;
  setDebugData: (key: string, data: unknown) => void;
  setHighlightedModule: (id: string | null) => void;
  toggleOverlay: () => void;
}

export const useDevelopmentStore = create<DevelopmentStore>()((set) => ({
  isOverlayOpen: false,
  position: { x: 100, y: 100 },
  size: { width: 400, height: 300 },
  debugData: {},
  highlightedModule: null,
  setOverlayOpen: (open: boolean) => set({ isOverlayOpen: open }),
  setPosition: (position: { x: number; y: number }) => set({ position }),
  setSize: (size: { width: number; height: number }) => set({ size }),
  setDebugData: (key: string, data: unknown) =>
    set((state) => ({
      debugData: { ...state.debugData, [key]: data },
    })),
  setHighlightedModule: (id: string | null) => set({ highlightedModule: id }),
  toggleOverlay: () =>
    set((state: DevelopmentStore) => ({
      isOverlayOpen: !state.isOverlayOpen,
    })),
}));
