import React from 'react';
import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-vh-100" style={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
    }}>
      <Header />
      <div className="container-xl py-4">
        <div className="row">
          <div className="col-12">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};