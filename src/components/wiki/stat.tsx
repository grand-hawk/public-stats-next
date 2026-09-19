import { Box, Stat as ChakraStat } from '@chakra-ui/react';
import React from 'react';

import StatArticleLink from '@/components/wiki/statArticleLink';

import type { StatArticleKey } from '@/content/statLinks';
import type { BoxProps } from '@chakra-ui/react';

export function StatGrid({ children, ...props }: BoxProps) {
  return (
    <Box
      className="mtc-frame"
      backgroundColor="var(--color-surface-1)"
      borderColor="border"
      borderRadius="8px"
      borderWidth="1px"
      padding="16px"
      {...props}
      css={{
        display: 'grid',
        gap: '16px',
        gridTemplateColumns: 'repeat(auto-fit, minmax(11rem, 1fr))',
        ...props.css,
      }}
    >
      {children}
    </Box>
  );
}

export interface StatProps {
  article?: StatArticleKey;
  children: React.ReactNode;
  label: React.ReactNode;
  rootProps?: ChakraStat.RootProps;
  labelProps?: ChakraStat.LabelProps;
  valueProps?: ChakraStat.ValueTextProps;
}

export default function Stat({
  article,
  children,
  label,
  labelProps,
  rootProps,
  valueProps,
}: StatProps) {
  return (
    <ChakraStat.Root flexShrink={0} gap={0} minWidth={0} {...rootProps}>
      <ChakraStat.Label
        color="fg.muted"
        {...labelProps}
        css={{
          fontSize: '0.875rem',
          fontWeight: 400,
          lineHeight: '1.375rem',
          ...labelProps?.css,
        }}
      >
        {article ? (
          <StatArticleLink article={article}>{label}</StatArticleLink>
        ) : (
          label
        )}
      </ChakraStat.Label>

      <ChakraStat.ValueText
        color="fg.emphasized"
        {...valueProps}
        css={{
          fontFamily: 'var(--font-family-base)',
          fontSize: '1rem',
          fontWeight: 500,
          fontVariantNumeric: 'tabular-nums',
          lineHeight: '1.625rem',
          ...valueProps?.css,
        }}
      >
        {children}
      </ChakraStat.ValueText>
    </ChakraStat.Root>
  );
}
