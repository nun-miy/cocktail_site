import React from 'react';
import { SearchBar } from './SearchBar';
import { IngredientFilter } from './IngredientFilter';
import { Button } from '../ui/Button';
import ingredientsData from '../../data/ingredients.json';

interface SearchFiltersProps {
  nameQuery: string;
  selectedIngredients: string[];
  onNameQueryChange: (query: string) => void;
  onIngredientToggle: (ingredient: string, checked: boolean) => void;
  onClearFilters: () => void;
  totalResults: number;
}

const categoryNames = {
  spirits: 'スピリッツ',
  liqueurs: 'リキュール',
  soft_drinks: 'ソフトドリンク',
  fruits: 'フルーツ',
  others: 'その他',
};

const categoryIcons = {
  spirits: '🥃',
  liqueurs: '🍯',
  soft_drinks: '🥤',
  fruits: '🍋',
  others: '🧂',
};

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  nameQuery,
  selectedIngredients,
  onNameQueryChange,
  onIngredientToggle,
  onClearFilters,
  totalResults,
}) => {
  const hasFilters = nameQuery || selectedIngredients.length > 0;

  return (
    <div className="space-y-6">
      <div className="bg-card-gradient rounded-xl shadow-card p-6 border border-white/20">
        <div className="flex items-center space-x-2 mb-6">
          <div className="text-2xl">🔍</div>
          <h2 className="text-2xl font-bold text-gradient">検索・絞り込み</h2>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <span className="flex items-center space-x-2">
              <span>🍸</span>
              <span>カクテル名で検索</span>
            </span>
          </label>
          <SearchBar
            value={nameQuery}
            onChange={onNameQueryChange}
            placeholder="例: モヒート、ジントニック、マルガリータ..."
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-white/50 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-gray-700 font-medium">
              {totalResults}件のカクテルが見つかりました
            </span>
          </div>
          {hasFilters && (
            <Button
              onClick={onClearFilters}
              variant="outline"
              size="sm"
              className="hover-lift"
            >
              ✨ フィルターをクリア
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-2">材料で絞り込み</h3>
          <p className="text-white/80 text-sm">
            複数選択すると、選択したすべての材料を含むカクテルが表示されます
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(ingredientsData).map(([categoryId, ingredients]) => (
            <IngredientFilter
              key={categoryId}
              categoryName={categoryNames[categoryId as keyof typeof categoryNames]}
              categoryIcon={categoryIcons[categoryId as keyof typeof categoryIcons]}
              ingredients={ingredients}
              selectedIngredients={selectedIngredients}
              onIngredientChange={onIngredientToggle}
            />
          ))}
        </div>
      </div>
    </div>
  );
};