import React from 'react';

import Layout from '@/components/utils/layout';
import { usePlace } from '@/hooks/usePlace';

export default function Place() {
  const place = usePlace();

  return <Layout>{JSON.stringify(place)}</Layout>;
}
