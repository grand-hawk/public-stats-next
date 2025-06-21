import fs from 'node:fs/promises';

import places_json from '@config/places.json';
import { controller } from '@scripts/updateData.utils.mjs';

const places = places_json as Record<string, number>;

interface Match {
  matchId: number;
  placeId: string;
  loadout: string;
  map: string;
  teams: Array<{
    matchTeamId: number;
    teamName: string;
    players: number;
    points: number[];
  }>;
  date: string;
}

async function getMatches(input: {
  placeId: string;
  maxAgeInSeconds: number;
  loadouts?: string[];
  maps?: string[];
}): Promise<Match[]> {
  return controller<Match[]>('matches.get', input);
}

async function getDistinct(placeId: string): Promise<{
  placeId: string[];
  loadout: string[];
  map: string[];
}> {
  return controller<{
    placeId: string[];
    loadout: string[];
    map: string[];
  }>('matches.distinct', placeId);
}

function seriesFromWinrate(matches: Match[]): Array<{
  name: string;
  data: Array<[number, number]>; // [timestamp, winrate]
}> {
  type TeamStats = {
    wins: number;
    totalMatches: number;
  };

  const teamData: Record<string, TeamStats> = {};
  const series: Array<{
    name: string;
    data: Array<[number, number]>;
  }> = [];

  matches.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  for (const match of matches) {
    const matchDate = new Date(match.date);
    matchDate.setHours(0, 0, 0, 0);
    const timestamp = matchDate.getTime();

    let winningTeamName: string | null = null;
    let highestScore = -Infinity;

    for (const team of match.teams) {
      const currentScore = team.points[team.points.length - 1] || 0;
      if (currentScore > highestScore) {
        highestScore = currentScore;
        winningTeamName = team.teamName;
      }

      if (!teamData[team.teamName])
        teamData[team.teamName] = { wins: 0, totalMatches: 0 };
    }

    for (const team of match.teams) {
      teamData[team.teamName].totalMatches++;
      if (team.teamName === winningTeamName && winningTeamName !== null) {
        teamData[team.teamName].wins++;
      }
    }

    for (const teamName in teamData) {
      const winrate =
        teamData[teamName].totalMatches > 0
          ? (teamData[teamName].wins / teamData[teamName].totalMatches) * 100
          : 0;

      let teamSeries = series.find((s) => s.name === teamName);
      if (!teamSeries) {
        teamSeries = { name: teamName, data: [] };
        series.push(teamSeries);
      }

      const lastDataPoint = teamSeries.data[teamSeries.data.length - 1];
      if (!lastDataPoint || lastDataPoint[0] !== timestamp)
        teamSeries.data.push([timestamp, winrate]);
      else lastDataPoint[1] = winrate;
    }
  }

  return series.filter((s) => s.data.length > 0);
}

const maxAgeInSeconds = 60 * 60 * 24 * 31;

for (const [, placeIdValue] of Object.entries(places)) {
  const placeId = placeIdValue.toString();
  await fs.mkdir(`./data/winrate/${placeId}`, { recursive: true });

  const distinct = await getDistinct(placeId);

  await fs.writeFile(
    `./data/winrate/${placeId}/metadata.json`,
    JSON.stringify(
      {
        date: new Date().toISOString(),
        loadouts: distinct.loadout,
        maps: distinct.map,
      },
      undefined,
      4,
    ),
  );

  const winrate = await getMatches({
    placeId,
    maxAgeInSeconds,
  });
  await fs.writeFile(
    `./data/winrate/${placeId}/winrate.json`,
    JSON.stringify(seriesFromWinrate(winrate), undefined, 4),
  );

  for (const map of distinct.map) {
    const mapWinrate = await getMatches({
      placeId,
      maxAgeInSeconds,
      maps: [map],
    });
    await fs.writeFile(
      `./data/winrate/${placeId}/winrate--${map}.json`,
      JSON.stringify(seriesFromWinrate(mapWinrate), undefined, 4),
    );
  }

  for (const loadout of distinct.loadout) {
    const loadoutWinrate = await getMatches({
      placeId,
      maxAgeInSeconds,
      loadouts: [loadout],
    });
    await fs.writeFile(
      `./data/winrate/${placeId}/winrate-${loadout}.json`,
      JSON.stringify(seriesFromWinrate(loadoutWinrate), undefined, 4),
    );

    for (const map of distinct.map) {
      const combinedWinrate = await getMatches({
        placeId,
        maxAgeInSeconds,
        loadouts: [loadout],
        maps: [map],
      });
      await fs.writeFile(
        `./data/winrate/${placeId}/winrate-${loadout}-${map}.json`,
        JSON.stringify(seriesFromWinrate(combinedWinrate), undefined, 4),
      );
    }
  }
}
