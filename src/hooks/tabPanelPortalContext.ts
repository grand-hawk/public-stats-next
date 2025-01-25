import { createContext } from 'react';

export const TabPanelPortalContext =
  createContext<React.RefObject<HTMLDivElement | null> | null>(null);
