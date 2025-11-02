import { buttonRecipe } from './button';
import { segmentGroupRecipe } from './segmentGroup';
import { selectRecipe } from './select';
import { alertRecipe } from '@/components/utils/chakra/recipes/alert';

export const recipes = {
  button: buttonRecipe,
};

export const slotRecipes = {
  alert: alertRecipe,
  segmentGroup: segmentGroupRecipe,
  select: selectRecipe,
};
