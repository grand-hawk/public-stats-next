import { useRouter } from 'next/router';
import React from 'react';
import { LuFlaskConical } from 'react-icons/lu';

import RailButton from '@/components/layout/rail/railButton';
import { toaster } from '@/components/ui/toaster';
import { Tooltip } from '@/components/ui/tooltip';
import { usePlaceInitials } from '@/hooks/usePlaceInitials';
import { useSuspenseConfig } from '@/hooks/useSuspenseConfig';

export default function PlaceToggle({
  direction,
}: {
  direction: 'column' | 'row';
}) {
  const router = useRouter();
  const config = useSuspenseConfig();
  const currentInitials = usePlaceInitials();

  const places = Object.entries(config.placeNameInitials).map(
    ([placeName, initials]) => ({ initials, placeName }),
  );
  if (places.length < 2) return null;

  const currentIndex = Math.max(
    places.findIndex((place) => place.initials === currentInitials),
    0,
  );
  const next = places[(currentIndex + 1) % places.length];
  const nextIsLive = next === places[0];

  const staging = currentIndex === 0 ? next : places[currentIndex];

  const switchPlace = async () => {
    await router.push({
      pathname: router.pathname,
      query: { ...router.query, place: next.initials },
    });
    toaster.create({
      id: 'place-switch',
      title: `Switched to ${next.placeName}`,
      type: nextIsLive ? 'success' : 'warning',
      duration: 2500,
    });
  };

  return (
    <Tooltip
      content={staging.placeName}
      positioning={{
        placement: direction === 'column' ? 'right' : 'top',
        gutter: 8,
      }}
    >
      <RailButton
        active={currentIndex !== 0}
        aria-pressed={currentIndex !== 0}
        label={`Switch to ${next.placeName}`}
        title={undefined}
        onClick={switchPlace}
      >
        <LuFlaskConical />
      </RailButton>
    </Tooltip>
  );
}
