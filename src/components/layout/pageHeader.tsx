import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import React from 'react';

import {
  DESKTOP_MEDIA,
  GUTTER_CSS,
  MEASURE,
  PAGE_WIDE,
} from '@/components/layout/shell/constants';
import { TRUNCATE_CSS } from '@/components/ui/styles';

export interface PageHeaderProps {
  subtitle?: string;
  title: string;
  wide?: boolean;
}

export default function PageHeader({
  subtitle,
  title,
  wide = false,
}: PageHeaderProps) {
  return (
    <Box
      as="header"
      css={{
        position: 'relative',
        zIndex: 1,
        marginTop: '24px',
        ...GUTTER_CSS,
      }}
    >
      <Box
        css={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          maxWidth: MEASURE,
          marginInline: 'auto',
          paddingBlock: '16px',
          flexWrap: 'wrap',
          [DESKTOP_MEDIA]: {
            flexWrap: 'nowrap',
            maxWidth: wide ? PAGE_WIDE : MEASURE,
          },
        }}
      >
        <Box flexGrow={1} minWidth={0}>
          <Flex
            alignItems="center"
            css={{ flexWrap: 'wrap', [DESKTOP_MEDIA]: { flexWrap: 'nowrap' } }}
          >
            <Heading
              as="h1"
              color="fg.emphasized"
              css={{
                fontSize: '1.75rem',
                fontWeight: 500,
                lineHeight: '2rem',
                marginBlock: 0,
                overflowWrap: 'break-word',
              }}
            >
              {title}
            </Heading>
          </Flex>
          {subtitle && (
            <Text
              color="fg.muted"
              css={{
                ...TRUNCATE_CSS,
                fontSize: '0.875rem',
                lineHeight: '1.25rem',
              }}
            >
              {subtitle}
            </Text>
          )}
        </Box>
      </Box>
    </Box>
  );
}
