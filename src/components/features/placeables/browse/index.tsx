import { Box, Text } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';
import slug from 'slug';

import { ArticleTable } from '@/components/article/elements';
import { ARTICLE_MDX_CSS } from '@/components/article/prose';
import TitledCard from '@/components/wiki/titledCard';
import { usePlace } from '@/hooks/usePlace';
import { loadoutDisplayName } from '@/utils/loadoutDisplayName';
import {
  PLACEABLE_KINDS,
  PLACEABLES_PATH,
  placeableDisplayName,
} from '@/utils/placeables';
import { trpc } from '@/utils/trpc';

import type { ListedPlaceable } from '@/server/api/trpc/routers/placeables';
import type { PlaceableKind } from '@generated/placeables';

function Loadouts({ loadouts }: { loadouts: string[] }) {
  const place = usePlace()!;

  if (loadouts.length === 0) return <>Every loadout</>;

  return (
    <>
      {loadouts.map((loadout, index) => (
        <React.Fragment key={loadout}>
          {index > 0 && ', '}
          <NextLink
            href={`/${place.initials}/loadouts/${slug(loadout)}`}
            prefetch={false}
          >
            {loadoutDisplayName(loadout)}
          </NextLink>
        </React.Fragment>
      ))}
    </>
  );
}

function KindTable({
  kind,
  rows,
}: {
  kind: PlaceableKind;
  rows: ListedPlaceable[];
}) {
  const place = usePlace()!;

  const nameCell = (placeable: ListedPlaceable) => (
    <td>
      <NextLink
        href={`/${place.initials}${PLACEABLES_PATH}/${placeable.slug}`}
        prefetch={false}
      >
        {placeableDisplayName(placeable.name)}
      </NextLink>
    </td>
  );

  if (kind === 'weapon') {
    return (
      <ArticleTable>
        <thead>
          <tr>
            <th>Placeable</th>
            <th>Weapons</th>
            <th>Classes</th>
            <th>Loadouts</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((placeable) => (
            <tr key={placeable.slug}>
              {nameCell(placeable)}
              <td>{placeable.weapons.join(', ') || 'None'}</td>
              <td>{placeable.classes.join(', ')}</td>
              <td>
                <Loadouts loadouts={placeable.loadouts} />
              </td>
            </tr>
          ))}
        </tbody>
      </ArticleTable>
    );
  }

  if (kind === 'offensive') {
    return (
      <ArticleTable>
        <thead>
          <tr>
            <th>Placeable</th>
            <th>Damage</th>
            <th>Penetration</th>
            <th>Classes</th>
            <th>Loadouts</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((placeable) => (
            <tr key={placeable.slug}>
              {nameCell(placeable)}
              <td>{placeable.damage ?? 'None'}</td>
              <td>
                {placeable.maxPenetration === undefined
                  ? 'None'
                  : `${placeable.maxPenetration} mm`}
              </td>
              <td>{placeable.classes.join(', ')}</td>
              <td>
                <Loadouts loadouts={placeable.loadouts} />
              </td>
            </tr>
          ))}
        </tbody>
      </ArticleTable>
    );
  }

  const healthColumn =
    kind === 'engineer' &&
    rows.some((placeable) => placeable.health !== undefined);

  return (
    <ArticleTable>
      <thead>
        <tr>
          <th>Placeable</th>
          <th>Cost</th>
          {healthColumn && <th>Health</th>}
          <th>Loadouts</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((placeable) => (
          <tr key={placeable.slug}>
            {nameCell(placeable)}
            <td>
              {placeable.cost === undefined
                ? 'None'
                : `${placeable.cost} of ${placeable.cap}`}
            </td>
            {healthColumn && (
              <td>{placeable.health ? `${placeable.health} HP` : 'N/A'}</td>
            )}
            <td>
              <Loadouts loadouts={placeable.loadouts} />
            </td>
          </tr>
        ))}
      </tbody>
    </ArticleTable>
  );
}

export default function PlaceablesBrowse() {
  const place = usePlace()!;
  const [placeables] = trpc.placeables.list.useSuspenseQuery({
    placeId: place.placeId,
  });

  return (
    <>
      {PLACEABLE_KINDS.map((kind) => {
        const rows = placeables.filter(
          (placeable) => placeable.kind === kind.key,
        );
        if (rows.length === 0) return null;

        return (
          <TitledCard key={kind.key} as="section" title={kind.label} withAnchor>
            <Text
              color="fg.muted"
              css={{
                fontSize: '0.875rem',
                lineHeight: '1.375rem',
                marginBlockEnd: '12px',
              }}
            >
              {kind.description}
            </Text>

            <Box css={ARTICLE_MDX_CSS}>
              <KindTable kind={kind.key} rows={rows} />
            </Box>
          </TitledCard>
        );
      })}
    </>
  );
}
