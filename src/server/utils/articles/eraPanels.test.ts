import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  groupEraPanels,
  sourcesFromVehicles,
} from '@/server/utils/articles/eraPanels';

import type { EraPanelSource } from '@/server/utils/articles/eraPanels';

const SOURCES: EraPanelSource[] = [
  {
    ke: 3,
    heat: 237,
    antiTandem: 0,
    vehicles: { 'T-72B': ['K1 Hull'], M1A1: ['ERA'], 'OBT-2U': ['ERA'] },
  },
  {
    ke: 150,
    heat: 210,
    antiTandem: 0.8,
    vehicles: { 'T-14 Armata': ['Relict'] },
  },
  {
    ke: 155,
    heat: 210,
    antiTandem: 0.8,
    vehicles: { 'T-90M': ['HullRelict'], 'T-14 Armata': ['Relict'] },
  },
  {
    ke: 20,
    heat: 280,
    antiTandem: 0.9,
    vehicles: { 'Challenger 2': ['NERA'] },
  },
];

const NAMES = {
  '3/237/0': { label: 'Kontakt-1', except: ['M1A1'] },
  '150/210/0.8': { label: 'Relikt, front panels' },
  '155/210/0.8': { label: 'Relikt, front panels' },
};

const AVAILABLE = new Map(
  ['T-72B', 'M1A1', 'T-14 Armata', 'T-90M', 'Challenger 2'].map((id) => [
    id,
    { name: id, slug: id.toLowerCase().replace(/ /g, '-') },
  ]),
);

test('merges panel types that share a name into one row with ranges', () => {
  const { named } = groupEraPanels(SOURCES, NAMES, AVAILABLE);
  const relikt = named.find((panel) => panel.label.startsWith('Relikt'))!;

  assert.deepEqual(relikt.ke, [150, 155]);
  assert.deepEqual(
    relikt.vehicles.map((vehicle) => vehicle.name),
    ['T-14 Armata', 'T-90M'],
  );
});

test('leaves out vehicles that are not available', () => {
  const { named } = groupEraPanels(SOURCES, NAMES, AVAILABLE);
  const kontakt = named.find((panel) => panel.label === 'Kontakt-1')!;

  assert.deepEqual(
    kontakt.vehicles.map((vehicle) => vehicle.name),
    ['T-72B'],
  );
});

test('excepted and unnamed panels are listed by vehicle', () => {
  const { specific } = groupEraPanels(SOURCES, NAMES, AVAILABLE);

  assert.deepEqual(
    specific.map((panel) => [panel.vehicles[0].name, panel.suffix]),
    [
      ['Challenger 2', 'NERA'],
      ['M1A1', 'ERA'],
    ],
  );
});

test('builds panel sources from exported vehicle data', () => {
  const sources = sourcesFromVehicles({
    'T-90M': {
      info: {
        gameId: 'T-90M',
        reactiveArmour: [
          { names: ['Rubber'], kinetic: 4, heat: 16, tandemResistance: 0 },
        ],
      },
    },
    'T-72B3': {
      info: {
        gameId: 'T-72B3',
        reactiveArmour: [
          { names: ['Skirts'], kinetic: 4, heat: 16, tandemResistance: 0 },
        ],
      },
    },
    'M4A2 Sherman': { info: { gameId: 'M4A2 Sherman' } },
  });

  assert.deepEqual(sources, [
    {
      ke: 4,
      heat: 16,
      antiTandem: 0,
      vehicles: { 'T-90M': ['Rubber'], 'T-72B3': ['Skirts'] },
    },
  ]);
});

test('reports that nothing was exported', () => {
  assert.equal(
    sourcesFromVehicles({ 'M4A2 Sherman': { info: { gameId: 'M4A2 Sherman' } } }),
    null,
  );
});
