import { Box, Heading, Text } from '@chakra-ui/react';
import React from 'react';

import { usePlace } from '@/hooks/usePlace';

export interface ArticleTitleProps {
  actions?: React.ReactNode;
  icon?: React.ReactNode;
  id?: string;
  meta?: React.ReactNode;
  title: string;
  titleLabel?: string;
}

export default function ArticleTitle({
  actions,
  icon,
  id,
  meta,
  title,
  titleLabel,
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
            aria-label={titleLabel}
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

      {actions}
    </Box>
  );
}
