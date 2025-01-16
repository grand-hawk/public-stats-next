import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export interface SessionStore {
  placeId?: number;
  setPlaceId: (placeId: number) => void;
}

export const useSessionStore = create(
  immer<SessionStore>((set) => ({
    placeId: undefined,
    setPlaceId: (placeId) => set({ placeId }),
  })),
);
