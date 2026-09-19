import { Box, Heading, Text } from '@chakra-ui/react';
import React from 'react';

import { NARROW_MEDIA } from '@/components/layout/shell/constants';
import { usePlace } from '@/hooks/usePlace';

export interface ArticleTitleProps {
  actions?: React.ReactNode;
  aside?: React.ReactNode;
  icon?: React.ReactNode;
  id?: string;
  meta?: React.ReactNode;
  title: string;
}

export default function ArticleTitle({
  actions,
  aside,
  icon,
  id,
  meta,
  title,
}: ArticleTitleProps) {
  const place = usePlace();

  return (
    <Box
      as="header"
      css={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: '16px',
        ...(aside && { flexWrap: 'wrap' }),
      }}
    >
      <Box flexGrow={1} minWidth={0}>
        <Box
          css={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            minWidth: 0,
          }}
        >
          {icon}

          <Heading
            as="h1"
            color="fg.emphasized"
            id={id}
            css={{
              fontSize: '1.75rem',
              fontWeight: 500,
              lineHeight: '2rem',
              marginBlock: 0,
              minWidth: 0,
              overflowWrap: 'break-word',
            }}
          >
            {title}
          </Heading>
        </Box>

        <Text
          color="fg.muted"
          id="siteSub"
          css={{
            fontSize: '0.875rem',
            lineHeight: '1.25rem',
            marginBlockStart: '4px',
          }}
        >
          From the {place?.placeName ?? 'Multicrew Tank Combat'} wiki
        </Text>

        {meta && (
          <Box
            color="fg.muted"
            css={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '4px 12px',
              fontSize: '0.875rem',
              lineHeight: '1.375rem',
              marginBlockStart: '8px',
            }}
          >
            {meta}
          </Box>
        )}
      </Box>

      {aside && (
        <Box
          css={{
            flex: 'none',
            width: '320px',
            maxWidth: '40%',
            '& figure': { margin: 0 },
            [NARROW_MEDIA]: { width: '100%', maxWidth: '100%', order: -1 },
          }}
        >
          {aside}
        </Box>
      )}

      {actions}
    </Box>
  );
}
