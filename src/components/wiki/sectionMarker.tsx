import React from 'react';
import slug from 'slug';

import { useSectionMarkers } from '@/hooks/providers/sectionMarkers';

export default function SectionMarker({
  anchor,
  name,
}: {
  name: string;
  anchor?: string;
}) {
  const { register, unregister } = useSectionMarkers();
  const markerSlug = anchor ? slug(anchor) : slug(name);

  React.useEffect(() => {
    register(name, markerSlug);
    return () => unregister(name);
  }, [name, markerSlug, register, unregister]);

  return null;
}
