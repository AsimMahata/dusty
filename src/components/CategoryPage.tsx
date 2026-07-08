import React from 'react';
import { Clock, List } from 'lucide-react';
import type { ItemData } from './ItemDetailPage';
import { ItemSection } from './ItemSection';

interface CategoryPageProps {
  title: string;
  recentItems: ItemData[];
  allItems: ItemData[];
  searchQuery?: string;
  onCardClick?: (item: ItemData) => void;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({ title, recentItems, allItems, searchQuery = "", onCardClick }) => {
  const query = searchQuery.toLowerCase();
  
  const filteredRecent = recentItems.filter(item => 
    item.title.toLowerCase().includes(query) ||
    item.subtitle.toLowerCase().includes(query) ||
    (item.metadata && item.metadata.toLowerCase().includes(query))
  );
  
  const filteredAll = allItems.filter(item => 
    item.title.toLowerCase().includes(query) ||
    item.subtitle.toLowerCase().includes(query) ||
    (item.metadata && item.metadata.toLowerCase().includes(query))
  );

  return (
    <div className="category-page">
      <ItemSection 
        title="Recent" 
        icon={<Clock size={20} />} 
        items={filteredRecent} 
        onCardClick={onCardClick} 
      />

      {filteredAll.length > 0 ? (
        <ItemSection 
          title={`All ${title}`} 
          icon={<List size={20} />} 
          items={filteredAll} 
          onCardClick={onCardClick} 
        />
      ) : (
        <div style={{ textAlign: 'center', marginTop: '48px', color: 'var(--text-muted)' }}>
          No results found for "{searchQuery}"
        </div>
      )}
    </div>
  );
};
