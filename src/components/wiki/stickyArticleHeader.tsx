import { Box, Flex } from '@chakra-ui/react';
import React from 'react';

import { GUTTER_CSS, MEASURE } from '@/components/layout/shell/constants';
import { TRUNCATE_CSS } from '@/components/ui/styles';

export interface StickyArticleHeaderProps {
  actions?: React.ReactNode;
  targetId: string;
  title: string;
}

export default function StickyArticleHeader({
  actions,
  targetId,
  title,
}: StickyArticleHeaderProps) {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(
          !entry.isIntersecting &&
            entry.boundingClientRect.top < (entry.rootBounds?.top ?? 0),
        );
      },
      { root: target.closest('main'), threshold: 0 },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [targetId]);

  return (
    <Box height={0} position="sticky" top={0} zIndex={10}>
      <Flex
        alignItems="center"
        aria-hidden={!isVisible}
        css={{
          ...GUTTER_CSS,
          position: 'absolute',
          insetBlockStart: 0,
          insetInline: 0,
          height: '48px',
          background:
            'color-mix(in oklch, var(--color-surface-0) 85%, transparent)',
          backdropFilter: 'blur(8px)',
          borderBlockEndWidth: '1px',
          borderBlockEndStyle: 'solid',
          borderColor: 'var(--border-color-base)',
          opacity: isVisible ? 1 : 0,
          pointerEvents: isVisible ? undefined : 'none',
          transform: isVisible ? 'translateY(0)' : 'translateY(-4px)',
          transition:
            'opacity 100ms var(--transition-timing-function-ease),' +
            ' transform 100ms var(--transition-timing-function-ease),' +
            ' visibility 100ms var(--transition-timing-function-ease)',
          visibility: isVisible ? 'visible' : 'hidden',
        }}
      >
        <Flex justifyContent="center" width="100%">
          <Flex
            alignItems="center"
            gap="16px"
            maxWidth={MEASURE}
            minWidth={0}
            width="100%"
          >
            <Box
              color="fg.emphasized"
              css={{
                ...TRUNCATE_CSS,
                fontSize: '16px',
                fontWeight: 500,
                lineHeight: '26px',
                minWidth: 0,
              }}
            >
              {title}
            </Box>

            {actions && <Box marginInlineStart="auto">{actions}</Box>}
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
}
