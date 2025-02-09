import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export interface SearchStore {
  input: string;
  setInput: (input: string) => void;
}

export const useSearchStore = create(
  persist(
    immer<SearchStore>((set) => ({
      input: '',
      setInput: (input) => set({ input }),
    })),
    {
      name: 'shells-search',
      version: 0,
    },
  ),
);
