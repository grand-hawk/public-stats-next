import { useRouter } from 'next/router';

import { toaster } from '@/components/ui/toaster';
import { usePlaceInitials } from '@/hooks/usePlaceInitials';
import { useSuspenseConfig } from '@/hooks/useSuspenseConfig';
import { setBranchCookie } from '@/utils/branchCookie';

export function usePlaceSwitch() {
  const router = useRouter();
  const config = useSuspenseConfig();
  const currentInitials = usePlaceInitials();

  const places = Object.entries(config.placeNameInitials).map(
    ([placeName, initials]) => ({ initials, placeName }),
  );
  const current =
    places.find((place) => place.initials === currentInitials) ?? places[0];
  const isStaging = current !== places[0];

  const setPlace = async (next: (typeof places)[number]) => {
    if (next === current) return;
    setBranchCookie(next === places[0] ? null : next.initials);
    await router.push({
      pathname: router.pathname,
      query: { ...router.query, place: next.initials },
    });
    toaster.create({
      id: 'place-switch',
      title: `Switched to ${next.placeName}`,
      type: next === places[0] ? 'success' : 'warning',
      duration: 2500,
    });
  };

  return { current, isStaging, places, setPlace };
}
