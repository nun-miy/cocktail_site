import React from 'react';
import type { Cocktail } from '../../types/cocktail';

interface CocktailDetailProps {
  cocktail: Cocktail;
  onClose: () => void;
}

export const CocktailDetail: React.FC<CocktailDetailProps> = ({ cocktail, onClose }) => {
  return (
    <div 
      className="modal fade show d-block" 
      style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(4px)'
      }}
      onClick={onClose}
    >
      <div className="modal-dialog modal-xl modal-dialog-scrollable">
        <div 
          className="modal-content border-0 shadow-lg"
          style={{ 
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="modal-header border-0 pb-0">
            <div className="d-flex align-items-center">
              <span className="fs-1 me-3">🍸</span>
              <div>
                <h2 className="modal-title fs-2 fw-bold mb-1" style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  {cocktail.name}
                </h2>
                <p className="text-muted mb-0 small">カクテルレシピの詳細</p>
              </div>
            </div>
            <button 
              type="button" 
              className="btn btn-outline-secondary btn-sm"
              onClick={onClose}
            >
              ✕ 閉じる
            </button>
          </div>

          {/* Modal Body */}
          <div className="modal-body p-4">
            <div className="row g-4">
              {/* 左側 - 材料とグラス情報 */}
              <div className="col-12 col-lg-6">
                {/* 材料セクション */}
                <div className="card border-0 shadow-sm mb-4" style={{
                  background: 'rgba(255, 255, 255, 0.7)'
                }}>
                  <div className="card-body">
                    <h3 className="card-title h5 fw-bold text-dark mb-3 d-flex align-items-center">
                      <span className="me-2">🥃</span>
                      材料 ({cocktail.ingredients.length}種類)
                    </h3>
                    <div className="d-grid gap-2">
                      {cocktail.ingredients.map((ingredient, index) => (
                        <div
                          key={index}
                          className="d-flex align-items-center p-3 bg-white rounded-2 shadow-sm"
                          style={{ transition: 'all 0.2s ease' }}
                          onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)'}
                          onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'}
                        >
                          <div 
                            className="rounded-circle me-3"
                            style={{
                              width: '12px',
                              height: '12px',
                              background: 'linear-gradient(45deg, #007bff, #6f42c1)'
                            }}
                          ></div>
                          <span className="text-dark fw-medium">{ingredient}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* グラス・ガーニッシュ情報 */}
                <div className="row g-3">
                  <div className="col-12 col-sm-6">
                    <div className="card border-0 shadow-sm h-100" style={{
                      background: 'rgba(255, 255, 255, 0.7)'
                    }}>
                      <div className="card-body">
                        <h3 className="card-title h6 fw-bold text-dark mb-2 d-flex align-items-center">
                          <span className="me-2">🥃</span>
                          グラス
                        </h3>
                        <p className="card-text text-dark fw-medium mb-0">{cocktail.glass}</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-6">
                    <div className="card border-0 shadow-sm h-100" style={{
                      background: 'rgba(255, 255, 255, 0.7)'
                    }}>
                      <div className="card-body">
                        <h3 className="card-title h6 fw-bold text-dark mb-2 d-flex align-items-center">
                          <span className="me-2">🍋</span>
                          ガーニッシュ
                        </h3>
                        <p className="card-text text-dark fw-medium mb-0">{cocktail.garnish}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 右側 - 作り方 */}
              <div className="col-12 col-lg-6">
                <div className="card border-0 shadow-sm h-100" style={{
                  background: 'rgba(255, 255, 255, 0.7)'
                }}>
                  <div className="card-body">
                    <h3 className="card-title h5 fw-bold text-dark mb-3 d-flex align-items-center">
                      <span className="me-2">📝</span>
                      作り方
                    </h3>
                    <div className="mb-4">
                      <p className="text-dark lh-lg">
                        {cocktail.recipe}
                      </p>
                    </div>
                    
                    <div className="alert alert-info border-0 d-flex align-items-start" style={{
                      background: 'linear-gradient(45deg, #e7f3ff, #f0e6ff)'
                    }}>
                      <span className="me-2">💡</span>
                      <div>
                        <strong className="small">ポイント:</strong>
                        <span className="small ms-1">材料の分量と手順を守って、美味しいカクテルを作りましょう</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};