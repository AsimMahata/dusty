import React from 'react';

interface CardProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  metadata?: string;
  size?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ title, subtitle, icon, metadata, size, onClick }) => {
  return (
    <div className="item-card" onClick={onClick}>
      <div className="card-icon-wrap">
        {icon}
      </div>
      <div className="card-content">
        <div className="card-title">{title}</div>
        <div className="card-subtitle">{subtitle}</div>
        {(metadata || size) && (
          <div className="card-meta">
            {metadata && (
              <span className="meta-item">
                <span>•</span> {metadata}
              </span>
            )}
            {size && (
              <span className="meta-item">
                <span>•</span> {size}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
