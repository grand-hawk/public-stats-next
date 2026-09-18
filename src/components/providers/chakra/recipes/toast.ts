import { defineSlotRecipe } from '@chakra-ui/react';
import { toastAnatomy } from '@chakra-ui/react/anatomy';

const tinted = (color: string) => ({
  '--toast-color': color,
  backgroundColor:
    'color-mix(in oklab, var(--toast-color) 12%, var(--color-surface-1))',
  borderColor:
    'color-mix(in oklab, var(--toast-color) 40%, var(--border-color-base))',
  color: 'var(--toast-color)',
});

export const toastRecipe = defineSlotRecipe({
  slots: toastAnatomy.keys(),
  base: {
    root: {
      alignItems: 'center',
      gap: '8px',
      padding: '8px 12px',
      backgroundColor: 'var(--color-surface-1)',
      borderWidth: '1px',
      borderColor: 'border',
      borderRadius: 'md',
      boxShadow: 'large',
      color: 'fg',
      '&[data-type=info], &[data-type=loading]': {
        backgroundColor: 'var(--color-surface-1)',
        color: 'fg',
      },
      '&[data-type=success]': tinted('var(--color-success)'),
      '&[data-type=warning]': tinted('var(--color-warning)'),
      '&[data-type=error]': tinted('var(--color-destructive)'),
    },
    title: {
      color: 'inherit',
      fontSize: '0.875rem',
      fontWeight: 'medium',
      lineHeight: '1.375rem',
      whiteSpace: 'nowrap',
    },
    description: {
      color: 'fg.muted',
      fontSize: '0.8125rem',
      lineHeight: '1.25rem',
      opacity: 1,
    },
    actionTrigger: {
      borderRadius: 'sm',
      cursor: 'pointer',
      marginTop: 'auto',
    },
  },
});
