import { Box } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

import {
  DURATION_BASE,
  EASE,
  NARROW_MEDIA,
} from '@/components/layout/shell/constants';
import { FOCUS_RING_CSS } from '@/components/ui/styles';

import type { SystemStyleObject } from '@chakra-ui/react';

const PageActionIconOnlyContext = React.createContext(false);

const BASE_CSS: SystemStyleObject = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  gap: '6px',
  height: '32px',
  paddingInline: '10px',
  borderWidth: 0,
  borderRadius: '4px',
  backgroundColor: 'transparent',
  color: 'fg',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: '22px',
  textDecoration: 'none',
  whiteSpace: 'nowrap',
  transition: `background-color ${DURATION_BASE} ${EASE}`,
  '& svg': {
    width: '16px',
    height: '16px',
    flexShrink: 0,
    color: 'fg.muted',
    transition: `color ${DURATION_BASE} ${EASE}`,
  },
  '&:hover': {
    backgroundColor: 'quiet.hover',
    textDecoration: 'none',
    '& svg': { color: 'fg' },
  },
  '&:active': { backgroundColor: 'quiet.active' },
  '&:focus-visible': { ...FOCUS_RING_CSS, outline: 'none' },
};

const COMPACT_CSS: SystemStyleObject = {
  width: '32px',
  minWidth: '32px',
  paddingInline: 0,
};

const PAGE_ACTION_CSS: SystemStyleObject = {
  ...BASE_CSS,
  [NARROW_MEDIA]: COMPACT_CSS,
};

const PAGE_ACTION_ICON_ONLY_CSS: SystemStyleObject = {
  ...BASE_CSS,
  ...COMPACT_CSS,
};

const LABEL_CSS: SystemStyleObject = {
  [NARROW_MEDIA]: {
    position: 'absolute',
    width: '1px',
    height: '1px',
    margin: '-1px',
    padding: 0,
    overflow: 'hidden',
    clipPath: 'inset(50%)',
    whiteSpace: 'nowrap',
  },
};

function PageActionLabel({ children }: { children: React.ReactNode }) {
  const iconOnly = React.useContext(PageActionIconOnlyContext);

  if (iconOnly) return null;

  return (
    <Box as="span" css={LABEL_CSS}>
      {children}
    </Box>
  );
}

export interface PageActionLinkProps {
  children: React.ReactNode;
  external?: boolean;
  href: string;
  label: string;
}

export function PageActionLink({
  children,
  external = false,
  href,
  label,
}: PageActionLinkProps) {
  const iconOnly = React.useContext(PageActionIconOnlyContext);

  return (
    <Box asChild css={iconOnly ? PAGE_ACTION_ICON_ONLY_CSS : PAGE_ACTION_CSS}>
      <NextLink
        aria-label={label}
        href={href}
        prefetch={false}
        rel={external ? 'nofollow' : undefined}
        target={external ? '_blank' : undefined}
        title={label}
      >
        {children}
        <PageActionLabel>{label}</PageActionLabel>
      </NextLink>
    </Box>
  );
}

export interface PageActionsProps {
  children: React.ReactNode;
  iconOnly?: boolean;
}

export default function PageActions({
  children,
  iconOnly = false,
}: PageActionsProps) {
  return (
    <PageActionIconOnlyContext.Provider value={iconOnly}>
      <Box
        aria-label="Page tools"
        data-md-ignore
        role="toolbar"
        css={{
          display: 'flex',
          alignItems: 'center',
          flexShrink: 0,
          gap: '2px',
        }}
      >
        {children}
      </Box>
    </PageActionIconOnlyContext.Provider>
  );
}
