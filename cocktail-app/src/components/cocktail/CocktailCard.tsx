import React from 'react';
import type { Cocktail } from '../../types/cocktail';

interface CocktailCardProps {
  cocktail: Cocktail;
  onClick: () => void;
}

export const CocktailCard: React.FC<CocktailCardProps> = ({ cocktail, onClick }) => {
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div
      onClick={onClick}
      className="bg-card-gradient rounded-xl shadow-card border border-white/20 p-6 cursor-pointer hover-lift transition-all duration-300 transform hover:scale-105"
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800 flex-1">
          {cocktail.name}
        </h3>
        <div className="text-2xl ml-2">🍸</div>
      </div>
      
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 mb-2 flex items-center">
          <span className="mr-2">🥃</span>
          材料 ({cocktail.ingredients.length}種類)
        </p>
        <div className="flex flex-wrap gap-2">
          {cocktail.ingredients.slice(0, 3).map((ingredient, index) => (
            <span
              key={index}
              className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-medium"
            >
              {ingredient}
            </span>
          ))}
          {cocktail.ingredients.length > 3 && (
            <span className="inline-block bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 text-xs px-3 py-1 rounded-full font-medium">
              +{cocktail.ingredients.length - 3}
            </span>
          )}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 mb-2 flex items-center">
          <span className="mr-2">📝</span>
          作り方
        </p>
        <p className="text-sm text-gray-600 leading-relaxed">
          {truncateText(cocktail.recipe, 80)}
        </p>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
          <span className="text-gray-600 flex items-center">
            <span className="mr-1">🥃</span>
            {cocktail.glass}
          </span>
          <span className="text-gray-600 flex items-center">
            <span className="mr-1">🍋</span>
            {cocktail.garnish}
          </span>
        </div>
        <div className="text-blue-600 font-medium hover:text-blue-800 transition-colors">
          詳細を見る →
        </div>
      </div>
    </div>
  );
};