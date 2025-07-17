export interface IngredientCategory {
  id: string;
  name: string;
  ingredients: string[];
}

export interface IngredientFilter {
  categoryId: string;
  ingredient: string;
  isSelected: boolean;
}

export const INGREDIENT_CATEGORIES: IngredientCategory[] = [
  {
    id: 'spirits',
    name: 'スピリッツ',
    ingredients: []
  },
  {
    id: 'liqueurs',
    name: 'リキュール',
    ingredients: []
  },
  {
    id: 'soft_drinks',
    name: 'ソフトドリンク',
    ingredients: []
  },
  {
    id: 'fruits',
    name: 'フルーツ',
    ingredients: []
  },
  {
    id: 'others',
    name: 'その他',
    ingredients: []
  }
];