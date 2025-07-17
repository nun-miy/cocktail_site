import React from 'react';
import type { Cocktail } from '../../types/cocktail';

interface TileCardProps {
  cocktail: Cocktail;
  onClick: () => void;
}

export const TileCard: React.FC<TileCardProps> = ({ cocktail, onClick }) => {
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div
      onClick={onClick}
      className="card h-100 shadow-sm border-0"
      style={{ 
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '';
      }}
    >
      <div className="card-body p-3 d-flex flex-column">
        {/* ヘッダー */}
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h5 className="card-title mb-0 fw-bold text-dark flex-grow-1 pe-2" style={{ lineHeight: '1.3' }}>
            {cocktail.name}
          </h5>
          <span className="fs-4">🍸</span>
        </div>
        
        {/* 作り方プレビュー */}
        <div className="mb-2 flex-grow-1">
          <p className="card-text text-muted small mb-0" style={{ 
            lineHeight: '1.4',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {truncateText(cocktail.recipe, 80)}
          </p>
        </div>
        
        {/* 材料 */}
        <div className="mb-2">
          <div className="d-flex flex-wrap gap-1">
            {cocktail.ingredients.slice(0, 2).map((ingredient, index) => (
              <span
                key={index}
                className="badge bg-info text-dark rounded-pill small"
              >
                {truncateText(ingredient, 10)}
              </span>
            ))}
            {cocktail.ingredients.length > 2 && (
              <span className="badge bg-gradient text-white rounded-pill small" style={{
                background: 'linear-gradient(45deg, #6f42c1, #e83e8c)'
              }}>
                +{cocktail.ingredients.length - 2}
              </span>
            )}
          </div>
        </div>

        {/* フッター */}
        <div className="mt-auto pt-2 border-top">
          <div className="row g-1 align-items-center text-muted small">
            <div className="col-8">
              <div className="d-flex flex-column gap-1">
                <div className="d-flex align-items-center">
                  <span className="me-1">🥃</span>
                  <span className="text-truncate">{truncateText(cocktail.glass, 12)}</span>
                </div>
                <div className="d-flex align-items-center">
                  <span className="me-1">🍋</span>
                  <span className="text-truncate">{truncateText(cocktail.garnish, 12)}</span>
                </div>
              </div>
            </div>
            <div className="col-4 text-end">
              <span className="text-primary fw-semibold small">
                詳細 →
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};