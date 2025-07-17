export interface Cocktail {
  name: string;
  ingredients: string[];
  recipe: string;
  glass: string;
  garnish: string;
}

export interface CocktailSearchResult {
  cocktail: Cocktail;
  score: number;
}

export interface SearchFilters {
  nameQuery: string;
  selectedIngredients: string[];
}

export interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}