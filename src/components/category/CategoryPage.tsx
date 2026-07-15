import React from 'react';
import { Clock, List } from 'lucide-react';
import type { TabHook } from '../../types/types';
import { ItemSection } from './ItemSection';

interface CategoryPageProps {
  tab: TabHook;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({ tab }) => {
  const [selectedItemId, setSelectedItemId] = React.useState<string | null>(null);

  const title = tab.title || "Unknown";
  const recentItems = tab.recentItems || [];
  const allItems = tab.allItems || [];
  const searchQuery = tab.searchQuery || "";
  const onCardClick = tab.onCardClick;
  const onTogglePin = tab.handleTogglePin;

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
        selectedItemId={selectedItemId}
        onCardSelect={setSelectedItemId}
        onCardClick={onCardClick} 
        onTogglePin={onTogglePin}
      />

      {filteredAll.length > 0 ? (
        <ItemSection 
          title={`All ${title}`} 
          icon={<List size={20} />} 
          items={filteredAll} 
          selectedItemId={selectedItemId}
          onCardSelect={setSelectedItemId}
          onCardClick={onCardClick} 
          onTogglePin={onTogglePin}
        />
      ) : (
        <div style={{ textAlign: 'center', marginTop: '48px', color: 'var(--text-muted)' }}>
          {searchQuery ? `No results found for "${searchQuery}"` : "No results found"}
        </div>
      )}
    </div>
  );
};
