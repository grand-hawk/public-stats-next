import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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
  persist(
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
    {
      name: 'vehicles.search',
      version: 0,
    },
  ),
);
