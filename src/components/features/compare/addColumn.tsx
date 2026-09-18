import { chakra } from '@chakra-ui/react';
import React from 'react';
import { LuPlus } from 'react-icons/lu';

import PickerList from '@/components/features/compare/pickerList';
import { DURATION_BASE, EASE } from '@/components/layout/shell/constants';
import {
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
} from '@/components/ui/popover';
import { FOCUS_RING_CSS, RAISED_FRAME_CSS } from '@/components/ui/styles';

import type { SystemStyleObject } from '@chakra-ui/react';

const TRIGGER_CSS: SystemStyleObject = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  height: '36px',
  paddingInline: '12px',
  borderWidth: 0,
  borderRadius: '4px',
  backgroundColor: 'var(--color-surface-2)',
  color: 'var(--color-emphasized)',
  cursor: 'pointer',
  fontSize: '0.875rem',
  fontWeight: 500,
  lineHeight: '1.375rem',
  whiteSpace: 'nowrap',
  transitionProperty: 'background-color',
  transitionDuration: DURATION_BASE,
  transitionTimingFunction: EASE,
  '& svg': { width: '16px', height: '16px', flex: 'none' },
  '&:hover': { backgroundColor: 'var(--color-surface-3)' },
  '&:active': { backgroundColor: 'var(--color-surface-4)' },
  '&:focus-visible': { ...FOCUS_RING_CSS, outline: 'none' },
  '@media (prefers-reduced-motion: reduce)': { transitionDuration: '0ms' },
};

const CONTENT_CSS: SystemStyleObject = {
  ...RAISED_FRAME_CSS,
  width: '280px',
  padding: 0,
  boxShadow: 'var(--box-shadow-large)',
  overflow: 'hidden',
};

interface AddColumnProps<T extends { slug: string }> {
  addLabel: string;
  emptyMessage: string;
  itemHeight: number;
  items: T[];
  matchesQuery: (item: T, simplifiedQuery: string) => boolean;
  placeholder: string;
  renderItem: (item: T) => React.ReactNode;
  selectedSlugs: string[];
  onAdd: (slug: string) => void;
}

export default function AddColumn<T extends { slug: string }>({
  addLabel,
  emptyMessage,
  itemHeight,
  items,
  matchesQuery,
  onAdd,
  placeholder,
  renderItem,
  selectedSlugs,
}: AddColumnProps<T>) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <PopoverRoot
      lazyMount
      unmountOnExit
      open={isOpen}
      positioning={{ placement: 'bottom' }}
      onOpenChange={(details) => setIsOpen(details.open)}
    >
      <PopoverTrigger asChild>
        <chakra.button css={TRIGGER_CSS} type="button">
          <LuPlus aria-hidden />
          {addLabel}
        </chakra.button>
      </PopoverTrigger>

      <PopoverContent css={CONTENT_CSS}>
        <PickerList
          emptyMessage={emptyMessage}
          itemHeight={itemHeight}
          items={items}
          matchesQuery={matchesQuery}
          placeholder={placeholder}
          renderItem={renderItem}
          selectedSlugs={selectedSlugs}
          onSelect={(slug) => {
            onAdd(slug);
            setIsOpen(false);
          }}
        />
      </PopoverContent>
    </PopoverRoot>
  );
}
