import assert from 'node:assert/strict';
import { test } from 'node:test';

import { groupApsSystems } from '@/server/utils/articles/aps';

import type { ApsModuleData } from '@/server/utils/articles/aps';

const trophy: ApsModuleData = {
  name: 'Trophy',
  ammo: 3,
  cooldown: 1.5,
  reactionTime: 0.3,
  interceptionSpeed: { max: 1000, min: 70 },
  interceptsDrones: true,
  launchers: 2,
  resistance: 0.1,
  traverse: {
    horizontal: { max: 120, min: -120 },
    vertical: { max: 85, min: -20 },
  },
};
const slow: ApsModuleData = {
  ...trophy,
  name: 'Anti Top Attack drones',
  interceptionSpeed: { max: 550, min: 5 },
};
const arena: ApsModuleData = { ...trophy, name: 'Arena APS' };
const unnamed: ApsModuleData = { ...trophy, name: 'APS' };

const VEHICLES = {
  merkava: {
    info: { gameId: 'Merkava Mk.4M' },
    modules: { a: { type: 'APS', data: trophy } },
  },
  namer: {
    info: { gameId: 'Namer APC' },
    modules: {
      a: { type: 'APS', data: trophy },
      b: { type: 'Seat', data: {} },
    },
  },
  panther: {
    info: { gameId: 'Panther KF51' },
    modules: {
      a: { type: 'APS', data: arena },
      b: { type: 'APS', data: slow },
    },
  },
  type10: {
    info: { gameId: 'Type 10' },
    modules: { a: { type: 'APS', data: unnamed } },
  },
  hidden: {
    info: { gameId: 'Neovenator' },
    modules: { a: { type: 'APS', data: trophy } },
  },
};

const AVAILABLE = new Map(
  ['Merkava Mk.4M', 'Namer APC', 'Panther KF51', 'Type 10'].map((id) => [
    id,
    { name: id, slug: id.toLowerCase().replace(/ /g, '-') },
  ]),
);

test('groups by name and figures, strips the APS suffix and puts generic names last', () => {
  const systems = groupApsSystems(VEHICLES, AVAILABLE);

  assert.deepEqual(
    systems.map((s) => [s.label, s.vehicles.map((v) => v.name)]),
    [
      ['Anti Top Attack drones', ['Panther KF51']],
      ['Arena', ['Panther KF51']],
      ['Trophy', ['Merkava Mk.4M', 'Namer APC']],
      ['Type 10 APS', ['Type 10']],
    ],
  );
  assert.equal(systems[2].horizontalWidth, 240);
});
