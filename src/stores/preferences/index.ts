import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export interface PreferencesStore {
  open: boolean;
  toggle(): void;
  close(): void;
}

export const usePreferencesStore = create(
  immer<PreferencesStore>((set) => ({
    open: false,
    toggle() {
      set((s) => {
        s.open = !s.open;
      });
    },
    close() {
      set((s) => {
        s.open = false;
      });
    },
  })),
);
