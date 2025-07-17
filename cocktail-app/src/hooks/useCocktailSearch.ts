import { useState, useEffect, useMemo } from 'react';
import type { Cocktail } from '../types/cocktail';
import { searchCocktails } from '../utils/search';
import { getPaginatedItems } from '../utils/pagination';

export const useCocktailSearch = (cocktails: Cocktail[], itemsPerPage: number = 10) => {
  const [nameQuery, setNameQuery] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredCocktails = useMemo(() => {
    return searchCocktails(cocktails, nameQuery, selectedIngredients);
  }, [cocktails, nameQuery, selectedIngredients]);

  const paginatedCocktails = useMemo(() => {
    return getPaginatedItems(filteredCocktails, currentPage, itemsPerPage);
  }, [filteredCocktails, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredCocktails.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [nameQuery, selectedIngredients]);

  const handleNameQueryChange = (query: string) => {
    setNameQuery(query);
  };

  const handleIngredientToggle = (ingredient: string, checked: boolean) => {
    setSelectedIngredients(prev => 
      checked 
        ? [...prev, ingredient]
        : prev.filter(item => item !== ingredient)
    );
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const clearFilters = () => {
    setNameQuery('');
    setSelectedIngredients([]);
    setCurrentPage(1);
  };

  return {
    nameQuery,
    selectedIngredients,
    currentPage,
    filteredCocktails,
    paginatedCocktails,
    totalPages,
    totalResults: filteredCocktails.length,
    handleNameQueryChange,
    handleIngredientToggle,
    handlePageChange,
    clearFilters,
  };
};