import { defineSlotRecipe } from '@chakra-ui/react';
import { selectAnatomy } from '@chakra-ui/react/anatomy';

export const selectRecipe = defineSlotRecipe({
  slots: selectAnatomy.keys(),
  base: {
    root: {
      borderWidth: '1px',
      borderRadius: 'sm',
    },
    trigger: {
      border: 'none',
      borderRadius: 'sm',
      minHeight: 'unset',
      paddingInline: 'unset',
    },
    content: {
      borderRadius: 'md',
    },
    item: {
      borderRadius: 'sm',
    },
  },
  variants: {
    size: {
      xs: {
        trigger: {
          paddingInline: 2,
          paddingBlock: 1,
        },
        indicatorGroup: {
          paddingInline: 2,
        },
      },
      sm: {
        control: {
          padding: 2,
        },
        indicatorGroup: {
          paddingInline: 2,
        },
      },
    },
  },
});
