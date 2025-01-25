import { KdrTab } from '@/components/tabs/kdr';
import { WinrateTab } from '@/components/tabs/winrate';

export interface Tab {
  label: string;
  Component: () => React.JSX.Element;
}

export const tabs: Record<string, Tab> = {
  kdr: {
    label: 'K/D Ratio',
    Component: KdrTab,
  },
  winrate: {
    label: 'Winrate',
    Component: WinrateTab,
  },
};
