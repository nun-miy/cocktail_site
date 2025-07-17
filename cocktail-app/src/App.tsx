import { useState } from 'react';
import { Layout } from './components/layout/Layout';
import { CompactSearchFilters } from './components/search/CompactSearchFilters';
import { CocktailList } from './components/cocktail/CocktailList';
import { CocktailDetail } from './components/cocktail/CocktailDetail';
import { useCocktailSearch } from './hooks/useCocktailSearch';
import type { Cocktail } from './types/cocktail';
import cocktailsData from './data/cocktails.json';

function App() {
  const [selectedCocktail, setSelectedCocktail] = useState<Cocktail | null>(null);
  
  const {
    nameQuery,
    selectedIngredients,
    currentPage,
    paginatedCocktails,
    totalPages,
    totalResults,
    handleNameQueryChange,
    handleIngredientToggle,
    handlePageChange,
    clearFilters,
  } = useCocktailSearch(cocktailsData as Cocktail[], 10);

  const handleCocktailClick = (cocktail: Cocktail) => {
    setSelectedCocktail(cocktail);
  };

  const handleCloseDetail = () => {
    setSelectedCocktail(null);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <CompactSearchFilters
          nameQuery={nameQuery}
          selectedIngredients={selectedIngredients}
          onNameQueryChange={handleNameQueryChange}
          onIngredientToggle={handleIngredientToggle}
          onClearFilters={clearFilters}
          totalResults={totalResults}
        />
        
        <CocktailList
          cocktails={paginatedCocktails}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onCocktailClick={handleCocktailClick}
        />
      </div>

      {selectedCocktail && (
        <CocktailDetail
          cocktail={selectedCocktail}
          onClose={handleCloseDetail}
        />
      )}
    </Layout>
  );
}

export default App;