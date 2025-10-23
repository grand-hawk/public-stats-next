import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export interface ShellsSearchStore {
  query: string;
  setQuery(query: string): void;
}

export const useShellsSearchStore = create(
  immer<ShellsSearchStore>((set) => ({
    query: '',
    setQuery(query) {
      set((s) => {
        s.query = query;
      });
    },
  })),
);
