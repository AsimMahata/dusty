import React from 'react';
import { Card } from './Card';
import type { ItemData } from '../../types/types';

interface ItemSectionProps {
  title: string;
  icon: React.ReactNode;
  items: ItemData[];
  selectedItemId?: string | null;
  onCardSelect?: (id: string) => void;
  onCardClick?: (item: ItemData) => void;
  onTogglePin?: (id: string) => void;
}

export const ItemSection: React.FC<ItemSectionProps> = ({ title, icon, items, selectedItemId, onCardSelect, onCardClick, onTogglePin }) => {

  if (items.length === 0) return null;

  return (
    <div className="category-section">
      <div className="section-title">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {icon}
          {title}
        </div>
        <span style={{ marginLeft: 'auto', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>
          {items.length}
        </span>
      </div>
      <div className="grid-container">
        {items.map((item, index) => (
          <Card 
            key={`${title}-${item.id}-${index}`}
            title={item.title}
            subtitle={item.subtitle}
            icon={item.icon}
            metadata={item.metadata}
            size={item.size}
            isSelected={selectedItemId === item.id}
            isPinned={item.is_pinned}
            onTogglePin={onTogglePin ? (e) => {
              e.stopPropagation();
              onTogglePin(item.id);
            } : undefined}
            onClick={() => {
              onCardSelect?.(item.id);
              onCardClick?.(item);
            }}
          />
        ))}
      </div>
    </div>
  );
};
