import { buttonRecipe } from './button';
import { segmentGroupRecipe } from './segmentGroup';
import { selectRecipe } from './select';
import { alertRecipe } from '@/components/utils/chakra/recipes/alert';
import { codeRecipe } from '@/components/utils/chakra/recipes/code';

export const recipes = {
  button: buttonRecipe,
  code: codeRecipe,
};

export const slotRecipes = {
  alert: alertRecipe,
  segmentGroup: segmentGroupRecipe,
  select: selectRecipe,
};
