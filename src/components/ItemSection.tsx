import React from 'react';
import { Card } from './Card';
import type { ItemData } from './ItemDetailPage';

interface ItemSectionProps {
  title: string;
  icon: React.ReactNode;
  items: ItemData[];
  onCardClick?: (item: ItemData) => void;
}

export const ItemSection: React.FC<ItemSectionProps> = ({ title, icon, items, onCardClick }) => {
  if (items.length === 0) return null;

  return (
    <div className="category-section">
      <div className="section-title">
        {icon}
        {title}
      </div>
      <div className="grid-container">
        {items.map((item) => (
          <Card 
            key={`${title}-${item.id}`}
            title={item.title}
            subtitle={item.subtitle}
            icon={item.icon}
            metadata={item.metadata}
            size={item.size}
            onClick={() => onCardClick?.(item)}
          />
        ))}
      </div>
    </div>
  );
};
