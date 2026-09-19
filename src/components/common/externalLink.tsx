import NextLink from 'next/link';
import React from 'react';

const EXTERNAL_HREF = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;

export const EXTERNAL_LINK_MARK_CSS = {
  '& a[data-external]::after': {
    content: '"\\2197"',
    marginInlineStart: '2px',
    fontSize: '0.75em',
  },
} as const;

export function isExternalHref(href: string) {
  return EXTERNAL_HREF.test(href);
}

export default function ExternalLink({
  children,
  ...props
}: React.ComponentProps<'a'>) {
  return (
    <a
      {...props}
      data-external
      rel="nofollow noopener noreferrer"
      target="_blank"
    >
      {children}
    </a>
  );
}

export function MarkdownAnchor({
  children,
  href = '',
}: React.ComponentProps<'a'>) {
  if (isExternalHref(href)) {
    return <ExternalLink href={href}>{children}</ExternalLink>;
  }

  return (
    <NextLink href={href} prefetch={false} shallow={href.startsWith('#')}>
      {children}
    </NextLink>
  );
}
