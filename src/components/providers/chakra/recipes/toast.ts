import { defineSlotRecipe } from '@chakra-ui/react';
import { toastAnatomy } from '@chakra-ui/react/anatomy';

export const toastRecipe = defineSlotRecipe({
  slots: toastAnatomy.keys(),
  base: {
    root: {
      borderRadius: 'md',
    },
    actionTrigger: {
      borderRadius: 'sm',
      cursor: 'pointer',
      marginTop: 'auto',
    },
  },
});
