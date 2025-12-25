import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface DevelopmentStore {
  isOverlayOpen: boolean;
  setOverlayOpen(open: boolean): void;

  position: { x: number; y: number };
  setPosition(position: { x: number; y: number }): void;

  size: { width: number; height: number };
  setSize(size: { width: number; height: number }): void;

  debugData: Record<string, unknown>;
  setDebugData(key: string, data: unknown): void;

  highlightedModule: string | null;
  setHighlightedModule(id: string | null): void;

  toggleOverlay(): void;
}

export const useDevelopmentStore = create<DevelopmentStore>()(
  persist(
    immer((set) => ({
      isOverlayOpen: false,
      position: { x: 100, y: 100 },
      size: { width: 800, height: 600 },
      debugData: {},
      highlightedModule: null,

      setOverlayOpen(open) {
        set((s) => {
          s.isOverlayOpen = open;
        });
      },

      setPosition(position) {
        set((s) => {
          s.position = position;
        });
      },

      setSize(size) {
        set((s) => {
          s.size = size;
        });
      },

      setDebugData(key, data) {
        set((s) => {
          s.debugData[key] = data;
        });
      },

      setHighlightedModule(id) {
        set((s) => {
          s.highlightedModule = id;
        });
      },

      toggleOverlay() {
        set((s) => {
          s.isOverlayOpen = !s.isOverlayOpen;
        });
      },
    })),
    {
      name: 'development',
    },
  ),
);
