import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export interface VehicleSearchStore {
  query: string;
  setQuery(query: string): void;

  groupByTeam: boolean;
  setGroupByTeam(groupByTeam: boolean): void;

  groupByRole: boolean;
  setGroupByRole(groupByRole: boolean): void;
}

export const useVehicleSearchStore = create(
  immer<VehicleSearchStore>((set) => ({
    query: '',
    setQuery(query) {
      set((s) => {
        s.query = query;
      });
    },

    groupByTeam: true,
    setGroupByTeam(groupByTeam) {
      set((s) => {
        s.groupByTeam = groupByTeam;
      });
    },

    groupByRole: false,
    setGroupByRole(groupByRole) {
      set((s) => {
        s.groupByRole = groupByRole;
      });
    },
  })),
);
