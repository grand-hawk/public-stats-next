import { Box } from '@chakra-ui/react';
import React from 'react';

import TeamIcon from '@/components/icons/teams';

const MAX_FLAGS = 3;

export default function TeamFlagStrip({
  size = 16,
  slots,
  teams,
}: {
  size?: number;
  slots?: number;
  teams: string[];
}) {
  const shown = teams.slice(0, MAX_FLAGS);
  const step = Math.round(size * 0.62);
  const width = size + ((slots ?? shown.length) - 1) * step;

  return (
    <Box
      flex="none"
      title={teams.join(', ')}
      css={{
        position: 'relative',
        height: `${size}px`,
        width: `${width}px`,
      }}
    >
      {shown.map((team, index) => (
        <Box
          key={team}
          css={{
            position: 'absolute',
            insetBlockStart: 0,
            insetInlineStart: `${index * step}px`,
            height: `${size}px`,
            width: `${size}px`,
            clipPath:
              index === 0
                ? undefined
                : 'polygon(32% 0, 100% 0, 100% 100%, 0 100%)',
          }}
        >
          <TeamIcon size={`${size}px`} team={team} />
        </Box>
      ))}
    </Box>
  );
}
