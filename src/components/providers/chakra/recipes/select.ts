import { defineSlotRecipe } from '@chakra-ui/react';
import { selectAnatomy } from '@chakra-ui/react/anatomy';

const FOCUSED = {
  outline: 'none',
  borderColor: 'var(--border-color-progressive--focus)',
  boxShadow: 'inset 0 0 0 1px var(--color-progressive)',
};

export const selectRecipe = defineSlotRecipe({
  slots: selectAnatomy.keys(),
  base: {
    trigger: {
      borderRadius: 'sm',
      color: 'fg',
      cursor: 'pointer',
      fontSize: '0.875rem',
      lineHeight: '1.375rem',
    },
    indicator: {
      color: 'fg.muted',
    },
    content: {
      gap: '2px',
      padding: '4px',
      backgroundColor: 'var(--color-surface-1)',
      borderWidth: '1px',
      borderColor: 'border',
      borderRadius: 'md',
      boxShadow: 'large',
    },
    item: {
      borderRadius: 'sm',
      color: 'fg',
      cursor: 'pointer',
      fontSize: '0.875rem',
      lineHeight: '1.375rem',
      _highlighted: { backgroundColor: 'quiet.hover' },
      _checked: {
        backgroundColor: 'quiet.active',
        color: 'fg.emphasized',
        fontWeight: 'medium',
      },
    },
    itemIndicator: {
      color: 'fg.emphasized',
    },
  },
  variants: {
    variant: {
      outline: {
        trigger: {
          backgroundColor: 'var(--color-surface-1)',
          borderWidth: '1px',
          borderColor: 'border.interactive',
          focusVisibleRing: 'none',
          _hover: { borderColor: 'var(--border-color-interactive--hover)' },
          _focusVisible: FOCUSED,
          _expanded: FOCUSED,
        },
      },
    },
    size: {
      xs: {
        trigger: { minHeight: '32px', paddingInline: '8px' },
        indicatorGroup: { paddingInline: '8px' },
        item: { minHeight: '32px', paddingInline: '8px' },
      },
      sm: {
        trigger: { minHeight: '40px', paddingInline: '12px' },
        indicatorGroup: { paddingInline: '12px' },
        item: { minHeight: '36px', paddingInline: '12px' },
      },
    },
  },
});
