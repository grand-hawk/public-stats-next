import { Box, FormatNumber } from '@chakra-ui/react';
import React from 'react';

import { ArticleTable } from '@/components/article/elements';
import MainArticle from '@/components/article/mainArticle';
import { ARTICLE_MDX_CSS } from '@/components/article/prose';
import Stat, { StatGrid } from '@/components/wiki/stat';
import StatArticleLink from '@/components/wiki/statArticleLink';
import TitledCard from '@/components/wiki/titledCard';
import { STAT_ARTICLES } from '@/content/statLinks';
import { usePlaceable } from '@/hooks/providers/placeable';

import type { PlaceablesPlaceDataPlaceableArmour } from '@generated/placeables';

type Panel = PlaceablesPlaceDataPlaceableArmour;

const isPlain = (panel: Panel) =>
  panel.heat === undefined &&
  panel.tandemResistance === undefined &&
  panel.slat === undefined;

const percent = (value: number) => `${Math.round(value * 100)}%`;

function thicknessRange(panels: Panel[]) {
  const values = panels.map((panel) => panel.thickness);
  const min = Math.min(...values);
  const max = Math.max(...values);

  return min === max ? `${min} mm` : `${min}–${max} mm`;
}

function PanelStats({ panel }: { panel: Panel }) {
  return (
    <>
      {panel.heat !== undefined && (
        <Stat label="Against HEAT">{panel.heat} mm</Stat>
      )}

      {panel.tandemResistance !== undefined && (
        <Stat
          label={
            <StatArticleLink article="tandem">
              Tandem resistance
            </StatArticleLink>
          }
        >
          {percent(panel.tandemResistance)}
        </Stat>
      )}

      {panel.slat !== undefined && (
        <Stat
          label={<StatArticleLink article="slat">Slat value</StatArticleLink>}
        >
          {percent(panel.slat)}
        </Stat>
      )}
    </>
  );
}

function PanelTable({ panels }: { panels: Panel[] }) {
  const heatColumn = panels.some((panel) => panel.heat !== undefined);
  const tandemColumn = panels.some(
    (panel) => panel.tandemResistance !== undefined,
  );
  const slatColumn = panels.some((panel) => panel.slat !== undefined);

  return (
    <ArticleTable>
      <thead>
        <tr>
          <th>
            <StatArticleLink article="armour">Armour</StatArticleLink>
          </th>
          {heatColumn && <th>Against HEAT</th>}
          {tandemColumn && (
            <th>
              <StatArticleLink article="tandem">
                Tandem resistance
              </StatArticleLink>
            </th>
          )}
          {slatColumn && (
            <th>
              <StatArticleLink article="slat">Slat value</StatArticleLink>
            </th>
          )}
        </tr>
      </thead>
      <tbody>
        {panels.map((panel, index) => (
          <tr key={index}>
            <td>{panel.thickness} mm</td>
            {heatColumn && (
              <td>{panel.heat === undefined ? 'None' : `${panel.heat} mm`}</td>
            )}
            {tandemColumn && (
              <td>
                {panel.tandemResistance === undefined
                  ? 'None'
                  : percent(panel.tandemResistance)}
              </td>
            )}
            {slatColumn && (
              <td>
                {panel.slat === undefined ? 'None' : percent(panel.slat)}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </ArticleTable>
  );
}

export default function PlaceableProtection() {
  const placeable = usePlaceable();
  const panels = (placeable.armour ?? []).filter((panel) => !panel.composite);

  if (placeable.health === undefined && panels.length === 0) return null;

  const plain = panels.filter(isPlain);
  const special = panels.filter((panel) => !isPlain(panel));
  const [only] = special;

  return (
    <TitledCard as="section" title="Protection" withAnchor>
      {special.some((panel) => panel.heat !== undefined) && (
        <MainArticle to={STAT_ARTICLES.era} />
      )}

      <StatGrid>
        {placeable.health !== undefined && (
          <Stat label="Health">
            <FormatNumber value={placeable.health} /> HP
          </Stat>
        )}

        {plain.length > 0 && (
          <Stat
            label={<StatArticleLink article="armour">Armour</StatArticleLink>}
          >
            {thicknessRange(plain)}
          </Stat>
        )}

        {special.length === 1 && (
          <>
            {plain.length === 0 && (
              <Stat
                label={
                  <StatArticleLink article="armour">Armour</StatArticleLink>
                }
              >
                {only.thickness} mm
              </Stat>
            )}

            <PanelStats panel={only} />
          </>
        )}
      </StatGrid>

      {special.length > 1 && (
        <Box css={ARTICLE_MDX_CSS} marginBlockStart={4}>
          <PanelTable panels={special} />
        </Box>
      )}
    </TitledCard>
  );
}
