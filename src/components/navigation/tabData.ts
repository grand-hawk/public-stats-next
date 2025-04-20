export interface Tab {
  label: string;
  path: string;
}

export const tabs: Record<string, Tab> = {
  kdr: {
    label: 'K/D Ratio',
    path: '/kdr',
  },
  winrate: {
    label: 'Winrate',
    path: '/winrate',
  },
  shells: {
    label: 'Shells',
    path: '/shells',
  },
  vehicles: {
    label: 'Vehicles',
    path: '/vehicles',
  },
};
