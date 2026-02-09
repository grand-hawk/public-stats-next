import { alertRecipe } from './alert';
import { badgeRecipe } from './badge';
import { buttonRecipe } from './button';
import { codeRecipe } from './code';
import { segmentGroupRecipe } from './segmentGroup';
import { selectRecipe } from './select';
import { toastRecipe } from './toast';

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
