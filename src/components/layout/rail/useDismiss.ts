import React from 'react';

export function useDismiss({
  cardRef,
  onDismiss,
  open,
  triggerRef,
}: {
  cardRef: React.RefObject<HTMLDivElement | null>;
  onDismiss: () => void;
  open: boolean;
  triggerRef: React.RefObject<HTMLElement | null>;
}) {
  React.useEffect(() => {
    if (!open) return;

    const outside = (event: Event) => {
      const target = event.target as Node;
      if (cardRef.current?.contains(target)) return;
      if (triggerRef.current?.contains(target)) return;
      const trigger = (target as Element)?.closest?.(
        '[aria-controls="citizen-drawer-card"]',
      );
      if (trigger) return;
      onDismiss();
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      const target = event.target as Element | null;
      if (target?.closest?.('[role="combobox"][aria-expanded="true"]')) return;
      onDismiss();
    };
    const linkClick = (event: Event) => {
      if ((event.target as Element)?.closest?.('a')) onDismiss();
    };

    const card = cardRef.current;
    window.addEventListener('mousedown', outside);
    window.addEventListener('touchstart', outside, { passive: true });
    window.addEventListener('focusin', outside);
    window.addEventListener('keydown', escape, true);
    window.addEventListener('beforeunload', onDismiss);
    card?.addEventListener('click', linkClick);

    return () => {
      window.removeEventListener('mousedown', outside);
      window.removeEventListener('touchstart', outside);
      window.removeEventListener('focusin', outside);
      window.removeEventListener('keydown', escape, true);
      window.removeEventListener('beforeunload', onDismiss);
      card?.removeEventListener('click', linkClick);
    };
  }, [cardRef, onDismiss, open, triggerRef]);
}
