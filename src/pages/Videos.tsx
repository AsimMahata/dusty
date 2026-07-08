import React, { useState, useEffect } from 'react';
import { CategoryPage } from '../components/CategoryPage';
import { ItemDetailPage, type ItemData } from '../components/ItemDetailPage';
import { PageLayout } from '../components/PageLayout';
import { mockData } from '../mockData';

let cachedVideosData: { recent: ItemData[], all: ItemData[] } | null = null;

export const Videos: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<ItemData | null>(null);
  const [data, setData] = useState<{ recent: ItemData[], all: ItemData[] }>(cachedVideosData || { recent: [], all: [] });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const newData = {
      recent: mockData.Videos.recent,
      all: mockData.Videos.all
    };
    
    cachedVideosData = newData;
    setData(newData);
    setIsRefreshing(false);
  };

  useEffect(() => {
    if (!cachedVideosData) {
      fetchData();
    }
  }, []);

  return (
    <PageLayout 
      title="Videos" 
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
          title="Videos" 
          recentItems={data.recent} 
          allItems={data.all} 
          searchQuery={searchQuery}
          onCardClick={setSelectedItem}
        />
      )}
    </PageLayout>
  );
};
