import { IconButton } from '@chakra-ui/react';
import React from 'react';
import { LuSearch } from 'react-icons/lu';

import SiteSearchDialog from '@/components/layout/search/siteSearchDialog';
import { useSearchStore } from '@/stores/search';

export function SiteSearchHost() {
  const open = useSearchStore((s) => s.open);
  const setOpen = useSearchStore((s) => s.setOpen);

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        const {
          heroFocus,
          open: isOpen,
          setOpen: set,
        } = useSearchStore.getState();
        if (isOpen) {
          set(false);
          return;
        }
        if (heroFocus) {
          heroFocus();
          return;
        }
        set(true);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return <SiteSearchDialog open={open} onOpenChange={setOpen} />;
}

interface SiteSearchIconTriggerProps {
  size?: 'sm' | 'md' | 'lg';
}

export function SiteSearchIconTrigger({
  size = 'sm',
}: SiteSearchIconTriggerProps = {}) {
  const onClick = React.useCallback(() => {
    const { heroFocus, setOpen } = useSearchStore.getState();
    if (heroFocus) {
      heroFocus();
      return;
    }
    setOpen(true);
  }, []);

  return (
    <IconButton
      aria-label="Search"
      onClick={onClick}
      size={size}
      variant="ghost"
    >
      <LuSearch />
    </IconButton>
  );
}
