import { Box } from '@chakra-ui/react';
import React from 'react';

import MenuColumn, {
  MENU_COLUMNS_MEDIA,
} from '@/components/layout/rail/menuColumn';
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
  const { articles, pages } = useMenuLinks();
  const hasArticles = articles.length > 0;
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
            width: hasArticles ? '480px' : '232px',
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
          <Box
            css={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr)',
              [MENU_COLUMNS_MEDIA]: {
                gridTemplateColumns: hasArticles
                  ? 'minmax(0, 1fr) minmax(0, 1fr)'
                  : 'minmax(0, 1fr)',
              },
              [DESKTOP_MEDIA]: {
                gridTemplateColumns: hasArticles
                  ? '232px minmax(0, 1fr)'
                  : 'minmax(0, 1fr)',
              },
            }}
          >
            <MenuColumn groups={pages} />

            {hasArticles && (
              <Box
                css={{
                  borderBlockStartWidth: '1px',
                  borderBlockStartStyle: 'solid',
                  borderColor: 'var(--border-color-subtle)',
                  [MENU_COLUMNS_MEDIA]: {
                    borderBlockStartWidth: 0,
                    borderInlineStartWidth: '1px',
                    borderInlineStartStyle: 'solid',
                  },
                }}
              >
                <MenuColumn labelled groups={articles} />
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
}
