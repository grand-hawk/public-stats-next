import { Box } from '@chakra-ui/react';
import React from 'react';

import MenuRow from '@/components/layout/rail/menuRow';
import { useDismiss } from '@/components/layout/rail/useDismiss';
import { useMenuLinks } from '@/components/layout/rail/useMenuLinks';
import { DESKTOP_MEDIA } from '@/components/layout/shell/constants';
import { RAISED_FRAME_CSS } from '@/components/ui/styles';
import {
  useWipe,
  wipeBackdropCss,
  wipeCardCss,
  wipeContentCss,
  wipeDirectionCss,
} from '@/components/ui/wipeCard';
import { useMenuStore } from '@/stores/menu';

export default function MenuCard({
  triggerRef,
}: {
  triggerRef: React.RefObject<HTMLElement | null>;
}) {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const open = useMenuStore((s) => s.open);
  const close = useMenuStore((s) => s.close);
  const groups = useMenuLinks();
  const wipe = useWipe(open);

  useDismiss({ cardRef, onDismiss: close, open, triggerRef });

  React.useEffect(() => {
    if (!open) return;
    if (window.matchMedia('(min-width: 1120px)').matches) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <>
      <Box
        aria-hidden
        css={{ ...wipeBackdropCss(wipe), [DESKTOP_MEDIA]: { display: 'none' } }}
      />

      <Box
        ref={cardRef}
        aria-label="Site menu"
        id="citizen-drawer-card"
        role="navigation"
        css={{
          ...RAISED_FRAME_CSS,
          ...wipeCardCss(wipe, 'up'),
          userSelect: 'none',
          left: '8px',
          right: '8px',
          bottom: '65px',
          maxHeight: 'calc(100dvh - 57px - 16px)',
          zIndex: 350,
          [DESKTOP_MEDIA]: {
            top: '8px',
            left: '64px',
            right: 'unset',
            bottom: 'unset',
            width: '232px',
            maxHeight: 'calc(100dvh - 16px)',
            zIndex: 50,
            ...wipeDirectionCss(wipe, 'right'),
          },
        }}
      >
        <Box
          css={{
            ...wipeContentCss(wipe),
            maxWidth: 'inherit',
            maxHeight: 'inherit',
          }}
        >
          <Box css={{ padding: '6px' }}>
            {groups.map((group) => (
              <Box
                aria-label={group.label}
                as="nav"
                key={group.label}
                css={{
                  '&:not(:first-of-type)': {
                    marginBlockStart: '6px',
                    paddingBlockStart: '6px',
                    borderBlockStartWidth: '1px',
                    borderBlockStartStyle: 'solid',
                    borderBlockStartColor: 'var(--border-color-subtle)',
                  },
                }}
              >
                <Box as="ul" css={{ margin: 0, listStyle: 'none' }}>
                  {group.links.map((link) => (
                    <MenuRow key={link.href + link.label} link={link} />
                  ))}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </>
  );
}
