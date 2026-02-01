import React from 'react';

export interface SectionMarker {
  name: string;
  slug: string;
}

export interface SectionMarkersContext {
  markers: SectionMarker[];
  activeSlug: string | null;
  setActiveSlug: (slug: string | null) => void;
  register: (name: string, slug: string) => void;
  unregister: (name: string) => void;
}

const SectionMarkersContext = React.createContext<SectionMarkersContext>({
  markers: [],
  activeSlug: null,
  setActiveSlug: () => {},
  register: () => {},
  unregister: () => {},
});

export function SectionMarkersProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [markers, setMarkers] = React.useState<SectionMarker[]>([]);
  const [activeSlug, setActiveSlug] = React.useState<string | null>(null);

  const register = React.useCallback((name: string, markerSlug: string) => {
    setMarkers((prev) => {
      if (prev.some((m) => m.name === name)) return prev;
      return [...prev, { name, slug: markerSlug }];
    });
  }, []);

  const unregister = React.useCallback((name: string) => {
    setMarkers((prev) => prev.filter((m) => m.name !== name));
  }, []);

  const value = React.useMemo(
    () => ({ markers, activeSlug, setActiveSlug, register, unregister }),
    [markers, activeSlug, register, unregister],
  );

  return (
    <SectionMarkersContext.Provider value={value}>
      {children}
    </SectionMarkersContext.Provider>
  );
}

export function useSectionMarkers() {
  return React.useContext(SectionMarkersContext);
}
