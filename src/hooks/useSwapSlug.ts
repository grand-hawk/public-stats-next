import React from 'react';

export function useSwapSlug(
  slug: string,
  prepare: (slug: string) => Promise<unknown>,
) {
  const [shownSlug, setShownSlug] = React.useState(slug);
  const prepareRef = React.useRef(prepare);

  React.useEffect(() => {
    prepareRef.current = prepare;
  });

  React.useEffect(() => {
    if (slug === shownSlug) return;

    let cancelled = false;
    prepareRef
      .current(slug)
      .catch(() => undefined)
      .then(() => {
        if (!cancelled) React.startTransition(() => setShownSlug(slug));
      });

    return () => {
      cancelled = true;
    };
  }, [shownSlug, slug]);

  return { shownSlug, isStale: shownSlug !== slug };
}
