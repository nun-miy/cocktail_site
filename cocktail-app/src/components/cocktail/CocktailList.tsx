import React from 'react';
import type { Cocktail } from '../../types/cocktail';
import { TileCard } from './TileCard';
import { Pagination } from './Pagination';

interface CocktailListProps {
  cocktails: Cocktail[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onCocktailClick: (cocktail: Cocktail) => void;
}

export const CocktailList: React.FC<CocktailListProps> = ({
  cocktails,
  currentPage,
  totalPages,
  onPageChange,
  onCocktailClick,
}) => {
  if (cocktails.length === 0) {
    return (
      <div className="text-center py-5">
        <div className="card shadow-sm border-0 mx-auto" style={{ 
          maxWidth: '400px',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          <div className="card-body p-5">
            <div style={{ fontSize: '4rem' }} className="mb-3">🔍</div>
            <h3 className="text-white mb-2">カクテルが見つかりませんでした</h3>
            <p className="text-white-50 mb-0">検索条件を変更してお試しください</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4">
      {/* ヘッダー */}
      <div className="text-center mb-4">
        <h2 className="h3 text-white fw-bold mb-2">
          🍸 カクテルレシピ ({cocktails.length}件)
        </h2>
        <p className="text-white-50 mb-0">
          気になるカクテルをクリックして詳細を確認しましょう
        </p>
      </div>
      
      {/* Bootstrapグリッド */}
      <div className="row g-4 mb-4">
        {cocktails.map((cocktail, index) => (
          <div 
            key={`${cocktail.name}-${index}`} 
            className="col-12 col-md-6 col-xl-4"
          >
            <TileCard
              cocktail={cocktail}
              onClick={() => onCocktailClick(cocktail)}
            />
          </div>
        ))}
      </div>
      
      {/* ページネーション */}
      <div className="d-flex justify-content-center">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};