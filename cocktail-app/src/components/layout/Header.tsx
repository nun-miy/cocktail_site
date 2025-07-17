import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-transparent text-white py-4">
      <div className="container-xl">
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="h2 mb-1 fw-bold">🍸 カクテルレシピ検索</h1>
                <p className="mb-0 opacity-75">あなたの完璧なカクテルを見つけよう</p>
              </div>
              <div className="text-end">
                <span className="badge bg-light text-dark px-3 py-2 rounded-pill">
                  616種のレシピ
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};