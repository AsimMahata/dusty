import React from 'react';
import { Card } from './Card';
import type { ActionItem, BaseItem, AnyItem, ItemCollection, Item } from '../../types/types';

interface ItemSectionProps<T extends BaseItem = AnyItem> {
  title: string;
  icon: React.ReactNode;
  items: T[];
  onCardDoubleClick?: (item: T) => void;
  onTogglePin?: (id: string) => void;
  getCardActions?: (item: T) => ActionItem[];
}

export function ItemSection<T extends BaseItem>({ title, icon, items, onCardDoubleClick, onTogglePin, getCardActions }: ItemSectionProps<T>) {

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
        {items.map((item) => (
          <Card 
            key={item.id}
            title={item.title}
            subtitle={item.subtitle}
            icon={item.icon}
            metadata={item.metadata}
            size={(item as Partial<Item>).size}
            isPinned={(item as Partial<ItemCollection>).is_pinned}
            status={(item as Partial<ItemCollection>).status}
            onTogglePin={onTogglePin ? (e) => {
              e.stopPropagation();
              onTogglePin(item.id);
            } : undefined}
            actions={getCardActions ? getCardActions(item) : undefined}
            onDoubleClick={() => {
              onCardDoubleClick?.(item);
            }}
          />
        ))}
      </div>
    </div>
  );
};
