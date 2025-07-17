import React, { useState } from 'react';
import { SearchBar } from './SearchBar';
import { IngredientFilter } from './IngredientFilter';
import { Button } from '../ui/Button';
import ingredientsData from '../../data/ingredients.json';

interface CompactSearchFiltersProps {
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

export const CompactSearchFilters: React.FC<CompactSearchFiltersProps> = ({
  nameQuery,
  selectedIngredients,
  onNameQueryChange,
  onIngredientToggle,
  onClearFilters,
  totalResults,
}) => {
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const hasFilters = nameQuery || selectedIngredients.length > 0;

  const toggleFilterMenu = () => {
    setIsFilterMenuOpen(!isFilterMenuOpen);
  };

  return (
    <div className="mb-4">
      {/* 検索エリア */}
      <div className="card shadow-sm border-0" style={{ 
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)' 
      }}>
        <div className="card-body p-4">
          <div className="row g-3 align-items-center">
            {/* 検索バー */}
            <div className="col-12 col-md-8 col-lg-9">
              <SearchBar
                value={nameQuery}
                onChange={onNameQueryChange}
                placeholder="カクテル名で検索..."
              />
            </div>
            
            {/* フィルターボタン */}
            <div className="col-12 col-md-4 col-lg-3">
              <button
                onClick={toggleFilterMenu}
                className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center"
                type="button"
                data-bs-toggle="offcanvas"
                data-bs-target="#filterOffcanvas"
              >
                <svg className="me-2" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/>
                </svg>
                フィルター
              </button>
            </div>
          </div>
          
          {/* 結果表示 */}
          <div className="row mt-3">
            <div className="col-12 col-md-6">
              <div className="d-flex align-items-center">
                <div className="spinner-grow spinner-grow-sm text-primary me-2" style={{ width: '12px', height: '12px' }}></div>
                <span className="fw-semibold text-dark">
                  {totalResults}件のカクテル
                </span>
              </div>
            </div>
            
            {selectedIngredients.length > 0 && (
              <div className="col-12 col-md-6 mt-2 mt-md-0">
                <div className="d-flex flex-column flex-md-row align-items-md-center">
                  <span className="text-muted me-2 small">選択中:</span>
                  <div className="d-flex flex-wrap gap-1">
                    {selectedIngredients.slice(0, 3).map((ingredient, index) => (
                      <span
                        key={index}
                        className="badge bg-primary rounded-pill small"
                      >
                        {ingredient}
                      </span>
                    ))}
                    {selectedIngredients.length > 3 && (
                      <span className="badge bg-secondary rounded-pill small">
                        +{selectedIngredients.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bootstrap Offcanvas フィルターメニュー */}
      <div className="offcanvas offcanvas-start" tabIndex={-1} id="filterOffcanvas">
        <div className="offcanvas-header">
          <h5 className="offcanvas-title">🔍 材料で絞り込み</h5>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas"></button>
        </div>
        <div className="offcanvas-body">
          <div className="small text-muted mb-3">
            複数選択すると、選択したすべての材料を含むカクテルが表示されます
          </div>
          
          {Object.entries(ingredientsData).map(([categoryId, ingredients]) => (
            <div key={categoryId} className="mb-4">
              <IngredientFilter
                categoryName={categoryNames[categoryId as keyof typeof categoryNames]}
                categoryIcon={categoryIcons[categoryId as keyof typeof categoryIcons]}
                ingredients={ingredients}
                selectedIngredients={selectedIngredients}
                onIngredientChange={onIngredientToggle}
              />
            </div>
          ))}
          
          {hasFilters && (
            <div className="border-top pt-3">
              <Button
                onClick={() => {
                  onClearFilters();
                  setIsFilterMenuOpen(false);
                }}
                variant="outline"
                size="sm"
                className="w-100"
              >
                ✨ すべてのフィルターをクリア
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};