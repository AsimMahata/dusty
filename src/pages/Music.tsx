import React, { useState, useEffect } from 'react';
import { CategoryPage } from '../components/CategoryPage';
import { ItemDetailPage, type ItemData } from '../components/ItemDetailPage';
import { PageLayout } from '../components/PageLayout';
import { mockData } from '../mockData';

let cachedMusicData: { recent: ItemData[], all: ItemData[] } | null = null;

export const Music: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<ItemData | null>(null);
  const [data, setData] = useState<{ recent: ItemData[], all: ItemData[] }>(cachedMusicData || { recent: [], all: [] });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const newData = {
      recent: mockData.Music.recent,
      all: mockData.Music.all
    };
    
    cachedMusicData = newData;
    setData(newData);
    setIsRefreshing(false);
  };

  useEffect(() => {
    if (!cachedMusicData) {
      fetchData();
    }
  }, []);

  return (
    <PageLayout 
      title="Music" 
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
          title="Music" 
          recentItems={data.recent} 
          allItems={data.all} 
          searchQuery={searchQuery}
          onCardClick={setSelectedItem}
        />
      )}
    </PageLayout>
  );
};
