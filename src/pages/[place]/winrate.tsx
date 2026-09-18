import { Box } from '@chakra-ui/react';
import { useQueryState } from 'nuqs';
import React from 'react';
import slug from 'slug';

import SimpleSelect from '@/components/common/simpleSelect';
import WinrateChartRoot from '@/components/features/winrate/chart/root';
import ArticlePage from '@/components/layout/articlePage';
import Layout from '@/components/layout/layout';
import { NARROW_MEDIA } from '@/components/layout/shell/constants';
import ArticleTitle from '@/components/wiki/articleTitle';
import { usePlace } from '@/hooks/usePlace';
import { slugifyArray } from '@/utils/slugifyArray';
import { trpc } from '@/utils/trpc';

const EMPTY_ARRAY: string[] = [];

const CONTROLS_CSS = {
  display: 'flex',
  gap: '12px',
  marginBlock: '24px',
  '& > *': { flex: '1 1 0', minWidth: 0, maxWidth: '320px' },
  '& label': {
    color: 'fg.muted',
    fontSize: '0.875rem',
    fontWeight: 400,
    lineHeight: '1.375rem',
  },
  [NARROW_MEDIA]: {
    flexDirection: 'column',
    '& > *': { maxWidth: 'none' },
  },
} as const;

export default function PlaceWinrate() {
  const place = usePlace()!;
  const [loadout, setLoadout] = useQueryState('loadout');
  const [map, setMap] = useQueryState('map');

  const [winrateMetadata] = trpc.winrate.metadata.useSuspenseQuery({
    placeId: place.placeId,
  });

  const loadoutOptions = winrateMetadata?.loadout ?? EMPTY_ARRAY;
  const mapOptions = winrateMetadata?.map ?? EMPTY_ARRAY;

  const [loadoutSlugs, mapSlugs] = React.useMemo(() => {
    return [slugifyArray(loadoutOptions), slugifyArray(mapOptions)];
  }, [loadoutOptions, mapOptions]);

  const firstLoadout = loadoutOptions[0] ?? null;
  const firstLoadoutSlug = React.useMemo(
    () => (firstLoadout ? slug(firstLoadout) : null),
    [firstLoadout],
  );

  React.useEffect(() => {
    if (!firstLoadoutSlug) return;

    if (!loadout || !loadoutSlugs[loadout]) setLoadout(firstLoadoutSlug);
  }, [firstLoadoutSlug, loadout, loadoutSlugs, setLoadout]);

  const actualLoadout =
    loadout && loadoutSlugs[loadout] ? loadoutSlugs[loadout] : null;
  const actualMap = map && mapSlugs[map];

  const resolvedLoadout = actualLoadout ?? firstLoadout ?? null;

  return (
    <Layout noPadding>
      <ArticlePage placeName={place.placeName} titleId="winrate-page-title">
        <ArticleTitle id="winrate-page-title" title="Winrate" />

        <Box css={CONTROLS_CSS}>
          <SimpleSelect
            items={loadoutOptions}
            label="Loadout"
            allowEmpty={false}
            value={resolvedLoadout}
            onValueChange={(value) => setLoadout(value ? slug(value) : null)}
          />

          <SimpleSelect
            items={mapOptions}
            label="Map"
            noValueLabel="All"
            value={actualMap}
            onValueChange={(value) => setMap(value ? slug(value) : null)}
          />
        </Box>

        <WinrateChartRoot loadout={resolvedLoadout} map={actualMap} />
      </ArticlePage>
    </Layout>
  );
}
