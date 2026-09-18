import { Box, Text } from '@chakra-ui/react';
import React from 'react';

import { DURATION_BASE, EASE } from '@/components/layout/shell/constants';

import type { BoxProps, SystemStyleObject, TextProps } from '@chakra-ui/react';

interface CardProps extends Omit<BoxProps, 'css'> {
  css?: SystemStyleObject;
}

interface CardTextProps extends Omit<TextProps, 'css'> {
  css?: SystemStyleObject;
}

export function Card({ css, ...props }: CardProps) {
  return (
    <Box
      backgroundColor="bg"
      borderColor="border"
      borderRadius="8px"
      borderWidth="1px"
      boxShadow="none"
      display="flex"
      flexDirection="column"
      marginBlock={0}
      minWidth={0}
      overflow="clip"
      {...props}
      css={css}
    />
  );
}

export function CardPad({ css, ...props }: CardProps) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      flexGrow={1}
      minWidth={0}
      padding="16px"
      {...props}
      css={css}
    />
  );
}

export function Kicker({ css, ...props }: CardTextProps) {
  return (
    <Text
      color="fg.muted"
      {...props}
      css={{
        fontFamily: 'var(--font-family-monospace)',
        fontSize: '12px',
        fontWeight: 500,
        letterSpacing: 'normal',
        lineHeight: '20px',
        marginBottom: '8px',
        textTransform: 'none',
        ...css,
      }}
    />
  );
}

export function CardTitle({ css, ...props }: CardTextProps) {
  return (
    <Text
      color="fg.emphasized"
      {...props}
      css={{
        fontSize: '16px',
        fontWeight: 500,
        lineHeight: '26px',
        ...css,
      }}
    />
  );
}

export function CardBody({ css, ...props }: CardTextProps) {
  return (
    <Text
      color="fg.muted"
      {...props}
      css={{
        fontSize: '14px',
        fontWeight: 400,
        lineHeight: '22px',
        marginTop: '4px',
        ...css,
      }}
    />
  );
}

export function CardMore({ css, ...props }: CardTextProps) {
  return (
    <Text
      {...props}
      css={{
        fontSize: '14px',
        fontWeight: 500,
        lineHeight: '22px',
        marginTop: 'auto',
        paddingTop: '8px',
        '& a': {
          color: 'var(--color-progressive)',
          textUnderlineOffset: '0.25em',
          transitionProperty: 'color',
          transitionDuration: DURATION_BASE,
          transitionTimingFunction: EASE,
        },
        '& a:hover': {
          color: 'var(--color-progressive--hover)',
          textDecoration: 'underline',
        },
        ...css,
      }}
    />
  );
}
