import React from 'react';

import { trpc } from '@/utils/trpc';

export function useFrontArmorDepth(
  placeId: string,
  slug: string | null,
  editable: boolean,
) {
  const { data: vehicle } = trpc.vehicles.bySlug.useQuery(
    { placeId, slug: slug ?? '' },
    { enabled: slug !== null },
  );

  const utils = trpc.useUtils();
  const { mutate } = trpc.vehicles.setFrontArmorDepth.useMutation({
    onSuccess: () => {
      utils.vehicles.bySlug.invalidate({ placeId, slug: slug ?? '' });
    },
  });

  const setFrontArmorDepth = React.useCallback(
    (percent: number) => {
      if (!slug || !editable) return;
      mutate({ slug, value: percent });
    },
    [editable, mutate, slug],
  );

  return {
    frontArmorDepth: vehicle?.info.frontArmorDepth,
    setFrontArmorDepth: editable ? setFrontArmorDepth : null,
  };
}
