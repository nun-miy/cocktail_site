import React from 'react';
import { Checkbox } from '../ui/Checkbox';

interface IngredientFilterProps {
  categoryName: string;
  categoryIcon: string;
  ingredients: string[];
  selectedIngredients: string[];
  onIngredientChange: (ingredient: string, checked: boolean) => void;
}

export const IngredientFilter: React.FC<IngredientFilterProps> = ({
  categoryName,
  categoryIcon,
  ingredients,
  selectedIngredients,
  onIngredientChange,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const displayCount = 8;
  const hasMore = ingredients.length > displayCount;
  const displayIngredients = isExpanded ? ingredients : ingredients.slice(0, displayCount);
  const selectedCount = selectedIngredients.filter(ing => ingredients.includes(ing)).length;

  return (
    <div className="bg-card-gradient rounded-xl p-6 shadow-card border border-white/20 hover-lift">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">{categoryIcon}</div>
          <h3 className="text-lg font-bold text-gray-800">
            {categoryName}
          </h3>
        </div>
        {selectedCount > 0 && (
          <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
            {selectedCount}
          </div>
        )}
      </div>
      
      <div className="space-y-3 max-h-60 overflow-y-auto">
        {displayIngredients.map((ingredient) => (
          <Checkbox
            key={ingredient}
            id={`${categoryName}-${ingredient}`}
            checked={selectedIngredients.includes(ingredient)}
            onChange={(checked) => onIngredientChange(ingredient, checked)}
            label={ingredient}
          />
        ))}
        {hasMore && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium py-2 px-4 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors duration-200"
          >
            {isExpanded ? 
              '📦 閉じる' : 
              `📦 他${ingredients.length - displayCount}件を表示`
            }
          </button>
        )}
      </div>
    </div>
  );
};