import { Box, Flex, Icon, Text, chakra } from '@chakra-ui/react';
import React from 'react';
import { LuScale } from 'react-icons/lu';

import { externalLinks } from '@/components/layout/navigation/tabs';
import {
  DESKTOP_MEDIA,
  GUTTER_CSS,
  MEASURE,
  NARROW_MEDIA,
} from '@/components/layout/shell/constants';

export interface SiteFooterProps {
  placeName: string;
}

const ROW_CSS = {
  display: 'flex',
  gap: '16px 32px',
  justifyContent: 'space-between',
  padding: '16px 0',
  [NARROW_MEDIA]: { flexDirection: 'column' },
} as const;

const PLACE_CSS = {
  display: 'block',
  padding: '8px 16px',
  borderRadius: '4px',
  color: 'fg.emphasized',
  fontWeight: 500,
  textDecoration: 'none',
  '&:hover': { backgroundColor: 'quiet.hover', textDecoration: 'none' },
  '&:active': { backgroundColor: 'quiet.active' },
} as const;

export default function SiteFooter({ placeName }: SiteFooterProps) {
  const places = [
    { external: true, href: externalLinks.github.href, label: 'GitHub' },
    { external: true, href: externalLinks.discord.href, label: 'Discord' },
  ];

  const footerRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    const footer = footerRef.current;
    const parent = footer?.parentElement;
    if (!footer || !parent) return;

    const publish = () =>
      parent.style.setProperty(
        '--site-footer-height',
        `${footer.offsetHeight}px`,
      );

    publish();
    const observer = new ResizeObserver(publish);
    observer.observe(footer);
    return () => {
      observer.disconnect();
      parent.style.removeProperty('--site-footer-height');
    };
  }, []);

  return (
    <Box
      ref={footerRef}
      as="footer"
      color="fg.muted"
      data-site-footer
      css={{
        marginTop: 'auto',
        paddingBlock: '224px 96px',
        fontSize: '0.875rem',
        lineHeight: '1.375rem',
        ...GUTTER_CSS,
      }}
    >
      <Box marginInline="auto" maxWidth={MEASURE}>
        <Box css={ROW_CSS}>
          <Flex direction="column" flexGrow={1} gap="8px" maxWidth="90ch">
            <Flex direction="column" gap="12px">
              <Text
                color="fg.emphasized"
                css={{
                  fontFamily: 'var(--font-family-monospace)',
                  fontSize: '1.5rem',
                  fontWeight: 500,
                  letterSpacing: '-0.02em',
                  lineHeight: 1.2,
                }}
              >
                multicrew.wiki
              </Text>
            </Flex>
            <Text css={{ margin: 0, lineHeight: '1.375rem' }}>
              The official wiki for {placeName}
            </Text>
          </Flex>

          <Box
            as="nav"
            css={{
              display: 'flex',
              alignItems: 'flex-end',
              flexGrow: 1,
              marginInline: '-16px',
              [DESKTOP_MEDIA]: { marginInline: 0, marginTop: '-8px' },
            }}
          >
            <Box
              as="ul"
              css={{
                display: 'grid',
                flexGrow: 1,
                gridTemplateColumns: 'repeat(auto-fit, minmax(10rem, 1fr))',
                margin: 0,
                padding: 0,
                listStyle: 'none',
              }}
            >
              {places.map(({ external, href, label }) => (
                <Box as="li" css={{ listStyle: 'none' }} key={label}>
                  <chakra.a
                    css={PLACE_CSS}
                    href={href}
                    rel={external ? 'noopener noreferrer' : undefined}
                    target={external ? '_blank' : undefined}
                  >
                    {label}
                  </chakra.a>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        <Box
          css={{
            ...ROW_CSS,
            alignItems: 'center',
            justifyContent: 'flex-start',
            borderTopWidth: '1px',
            borderTopStyle: 'solid',
            borderTopColor: 'border',
            [NARROW_MEDIA]: {
              flexDirection: 'column',
              alignItems: 'flex-start',
            },
          }}
        >
          <chakra.a
            css={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'fg.emphasized',
              fontWeight: 500,
              opacity: 0.6,
              transition: 'opacity 250ms ease',
              '&:hover': { opacity: 0.74, textDecoration: 'none' },
              '&:active': { opacity: 0.87 },
            }}
            href={externalLinks.license.href}
            rel="noopener noreferrer"
            target="_blank"
          >
            <Icon as={LuScale} boxSize="20px" />
            Content is available under CC BY-NC 4.0
          </chakra.a>
        </Box>
      </Box>
    </Box>
  );
}
