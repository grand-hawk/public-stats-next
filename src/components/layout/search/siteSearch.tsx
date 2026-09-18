import React from 'react';

import SiteSearchPalette from '@/components/layout/search/siteSearchPalette';
import { SEARCH_INPUT_ID } from '@/components/layout/search/useSiteSearch';
import { openSiteSearch, useSearchStore } from '@/stores/search';

const NON_EDITABLE_INPUT_TYPES = new Set([
  'submit',
  'reset',
  'checkbox',
  'radio',
  'button',
]);

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  if (target instanceof HTMLInputElement) {
    return !NON_EDITABLE_INPUT_TYPES.has(target.type);
  }
  const tag = target.tagName;
  return tag === 'TEXTAREA' || tag === 'SELECT';
}

export function SiteSearchHost() {
  const open = useSearchStore((s) => s.open);
  const openerRef = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isEditableTarget(event.target)) return;
      const isCmdK =
        (event.metaKey || event.ctrlKey) &&
        !event.altKey &&
        !event.shiftKey &&
        event.key.toLowerCase() === 'k';
      const isSlash =
        event.key === '/' && !event.metaKey && !event.ctrlKey && !event.altKey;
      if (!isCmdK && !isSlash) return;
      event.preventDefault();
      if (useSearchStore.getState().open) {
        document.getElementById(SEARCH_INPUT_ID)?.focus();
        return;
      }
      openSiteSearch();
    };
    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, []);

  React.useEffect(
    () =>
      useSearchStore.subscribe((state, previous) => {
        if (!state.open || previous.open) return;
        const active = document.activeElement;
        openerRef.current = active instanceof HTMLElement ? active : null;
      }),
    [],
  );

  React.useEffect(() => {
    if (open) return;
    const opener = openerRef.current;
    openerRef.current = null;
    if (opener?.isConnected) opener.focus();
  }, [open]);

  return <SiteSearchPalette />;
}
