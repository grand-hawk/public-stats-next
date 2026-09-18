import React from 'react';
import { LuBug, LuSearch } from 'react-icons/lu';
import { MdRefresh } from 'react-icons/md';

import HamburgerIcon from '@/components/layout/rail/hamburgerIcon';
import PlaceToggle from '@/components/layout/rail/placeToggle';
import RailQuickLinks from '@/components/layout/rail/quickLinks';
import RailButton from '@/components/layout/rail/railButton';
import { env } from '@/env';
import { useDebugEnabled } from '@/hooks/useDebugEnv';
import { useDevelopmentStore } from '@/stores/development';
import { useMenuStore } from '@/stores/menu';
import { openSiteSearch } from '@/stores/search';
import { trpc } from '@/utils/trpc';

export function RailPrimaryItems({
  direction,
  triggerRef,
}: {
  direction: 'column' | 'row';
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const menuOpen = useMenuStore((s) => s.open);
  const toggleMenu = useMenuStore((s) => s.toggle);

  return (
    <>
      <RailButton
        label="Search"
        onClick={openSiteSearch}
        title="Toggle search [/]"
      >
        <LuSearch />
      </RailButton>

      <RailQuickLinks direction={direction} />

      <RailButton
        ref={triggerRef}
        active={menuOpen}
        aria-controls="citizen-drawer-card"
        aria-expanded={menuOpen}
        label="Menu"
        onClick={toggleMenu}
        title="Toggle menu"
      >
        <HamburgerIcon open={menuOpen} />
      </RailButton>
    </>
  );
}

export function RailSecondaryItems({
  direction,
}: {
  direction: 'column' | 'row';
}) {
  const debugEnabled = useDebugEnabled();
  const utils = trpc.useUtils();
  const { isOverlayOpen, toggleOverlay } = useDevelopmentStore();

  return (
    <>
      {env.NEXT_PUBLIC_STACKBLITZ && (
        <RailButton label="Refresh data" onClick={() => utils.invalidate()}>
          <MdRefresh />
        </RailButton>
      )}

      {debugEnabled && (
        <RailButton
          active={isOverlayOpen}
          label="Debug"
          onClick={toggleOverlay}
        >
          <LuBug />
        </RailButton>
      )}

      <PlaceToggle direction={direction} />
    </>
  );
}
