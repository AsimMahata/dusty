import React, { useState, useEffect } from 'react';
import { CategoryPage } from '../components/CategoryPage';
import { ItemDetailPage, type ItemData } from '../components/ItemDetailPage';
import { PageLayout } from '../components/PageLayout';
import { mockData } from '../mockData';

// Cache to store the data outside the component lifecycle so it persists across page changes
let cachedShowsData: { recent: ItemData[], all: ItemData[] } | null = null;

export const Shows: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<ItemData | null>(null);
  const [data, setData] = useState<{ recent: ItemData[], all: ItemData[] }>(cachedShowsData || { recent: [], all: [] });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = async () => {
    setIsRefreshing(true);
    // Simulate backend network delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const newData = {
      recent: mockData.Shows.recent,
      all: mockData.Shows.all
    };
    
    cachedShowsData = newData; // Update cache
    setData(newData);
    setIsRefreshing(false);
  };

  useEffect(() => {
    // Only fetch if we don't have cached data
    if (!cachedShowsData) {
      fetchData();
    }
  }, []);

  return (
    <PageLayout 
      title="Shows" 
      searchQuery={searchQuery} 
      setSearchQuery={setSearchQuery}
      hideSearch={!!selectedItem}
      onRefresh={fetchData}
      isRefreshing={isRefreshing}
      isLoading={isRefreshing && data.all.length === 0}
    >
      {selectedItem ? (
        <ItemDetailPage item={selectedItem} onBack={() => setSelectedItem(null)} />
      ) : (
        <CategoryPage 
          title="Shows" 
          recentItems={data.recent} 
          allItems={data.all} 
          searchQuery={searchQuery}
          onCardClick={setSelectedItem}
        />
      )}
    </PageLayout>
  );
};
