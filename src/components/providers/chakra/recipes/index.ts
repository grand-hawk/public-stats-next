import { alertRecipe } from '@/components/providers/chakra/recipes/alert';
import { badgeRecipe } from '@/components/providers/chakra/recipes/badge';
import { buttonRecipe } from '@/components/providers/chakra/recipes/button';
import { codeRecipe } from '@/components/providers/chakra/recipes/code';
import { segmentGroupRecipe } from '@/components/providers/chakra/recipes/segmentGroup';
import { selectRecipe } from '@/components/providers/chakra/recipes/select';
import { toastRecipe } from '@/components/providers/chakra/recipes/toast';

export const recipes = {
  badge: badgeRecipe,
  button: buttonRecipe,
  code: codeRecipe,
};

export const slotRecipes = {
  alert: alertRecipe,
  segmentGroup: segmentGroupRecipe,
  select: selectRecipe,
  toast: toastRecipe,
};
