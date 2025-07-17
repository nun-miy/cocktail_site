import Fuse from 'fuse.js';
import type { Cocktail } from '../types/cocktail';

const fuseOptions = {
  keys: ['name'],
  threshold: 0.3,
  includeScore: true,
  minMatchCharLength: 2,
};

export const searchCocktailsByName = (cocktails: Cocktail[], query: string): Cocktail[] => {
  if (!query.trim()) {
    return cocktails;
  }

  const fuse = new Fuse(cocktails, fuseOptions);
  const results = fuse.search(query);
  return results.map(result => result.item);
};

export const filterCocktailsByIngredients = (cocktails: Cocktail[], selectedIngredients: string[]): Cocktail[] => {
  if (selectedIngredients.length === 0) {
    return cocktails;
  }

  return cocktails.filter(cocktail => {
    return selectedIngredients.every(ingredient => 
      cocktail.ingredients.some(cocktailIngredient => 
        cocktailIngredient.toLowerCase().includes(ingredient.toLowerCase())
      )
    );
  });
};

export const searchCocktails = (
  cocktails: Cocktail[], 
  nameQuery: string, 
  selectedIngredients: string[]
): Cocktail[] => {
  let results = cocktails;
  
  if (nameQuery.trim()) {
    results = searchCocktailsByName(results, nameQuery);
  }
  
  if (selectedIngredients.length > 0) {
    results = filterCocktailsByIngredients(results, selectedIngredients);
  }
  
  return results;
};