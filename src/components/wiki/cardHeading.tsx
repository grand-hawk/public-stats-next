import { Box, Heading } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

import type { HeadingProps, SystemStyleObject } from '@chakra-ui/react';

export const HEADING_LEVEL_CSS: Record<string, SystemStyleObject> = {
  h2: { fontSize: '1.5rem', lineHeight: '2.125rem' },
  h3: { fontSize: '1.125rem', lineHeight: '1.625rem' },
  h4: { fontSize: '1rem', lineHeight: '1.625rem' },
};

const HEADING_CSS: SystemStyleObject = {
  marginBlock: 0,
  minWidth: 0,
  overflowWrap: 'break-word',
  scrollMarginTop: '64px',
};

const ANCHOR_CSS: SystemStyleObject = {
  color: 'inherit',
  textDecoration: 'none',
  '&:hover': { textDecoration: 'underline' },
};

export interface CardHeadingProps {
  as: HeadingProps['as'];
  id: string;
  onAnchorClick?: () => void;
  title: string;
  typography: SystemStyleObject;
  withAnchor?: boolean | string;
}

export default function CardHeading({
  as,
  id,
  onAnchorClick,
  title,
  typography,
  withAnchor,
}: CardHeadingProps) {
  return (
    <Heading
      as={as}
      color="fg.emphasized"
      id={id}
      css={{ ...HEADING_CSS, ...typography }}
    >
      {withAnchor ? (
        <Box asChild css={ANCHOR_CSS}>
          <NextLink href={`#${id}`} shallow onClick={onAnchorClick}>
            {title}
          </NextLink>
        </Box>
      ) : (
        title
      )}
    </Heading>
  );
}
