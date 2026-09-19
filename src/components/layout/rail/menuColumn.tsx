import { Box } from '@chakra-ui/react';
import React from 'react';

import MenuRow from '@/components/layout/rail/menuRow';

import type { ResolvedMenuGroup } from '@/components/layout/rail/useMenuLinks';

export const MENU_COLUMNS_MEDIA = '@media (min-width: 560px)';
const MENU_STACKED_MEDIA = '@media (max-width: 559.98px)';

export default function MenuColumn({
  groups,
  labelled = false,
}: {
  groups: ResolvedMenuGroup[];
  labelled?: boolean;
}) {
  return (
    <Box css={{ padding: '6px' }}>
      {groups.map((group) => (
        <Box
          aria-label={group.label}
          as="nav"
          key={group.label}
          css={{
            '&:not(:first-of-type)': {
              marginBlockStart: '6px',
              paddingBlockStart: '6px',
              borderBlockStartWidth: '1px',
              borderBlockStartStyle: 'solid',
              borderBlockStartColor: 'var(--border-color-subtle)',
            },
            ...(labelled && {
              [MENU_STACKED_MEDIA]: {
                '&:not(:first-of-type)': {
                  marginBlockStart: 0,
                  paddingBlockStart: 0,
                  borderBlockStartWidth: 0,
                },
              },
            }),
          }}
        >
          {labelled && (
            <Box
              aria-hidden
              color="fg.muted"
              css={{
                padding: '4px 10px',
                fontSize: '0.75rem',
                lineHeight: '1.25rem',
                [MENU_STACKED_MEDIA]: { display: 'none' },
              }}
            >
              {group.label}
            </Box>
          )}

          <Box as="ul" css={{ margin: 0, listStyle: 'none' }}>
            {group.links.map((link) => (
              <MenuRow key={link.href + link.label} link={link} />
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
}
