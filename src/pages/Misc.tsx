import React, { useState, useEffect } from 'react';
import { CategoryPage } from '../components/CategoryPage';
import { ItemDetailPage, type ItemData } from '../components/ItemDetailPage';
import { PageLayout } from '../components/PageLayout';
import { mockData } from '../mockData';

let cachedMiscData: { recent: ItemData[], all: ItemData[] } | null = null;

export const Misc: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<ItemData | null>(null);
  const [data, setData] = useState<{ recent: ItemData[], all: ItemData[] }>(cachedMiscData || { recent: [], all: [] });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const newData = {
      recent: mockData.Misc.recent,
      all: mockData.Misc.all
    };
    
    cachedMiscData = newData;
    setData(newData);
    setIsRefreshing(false);
  };

  useEffect(() => {
    if (!cachedMiscData) {
      fetchData();
    }
  }, []);

  return (
    <PageLayout 
      title="Misc" 
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
          title="Misc" 
          recentItems={data.recent} 
          allItems={data.all} 
          searchQuery={searchQuery}
          onCardClick={setSelectedItem}
        />
      )}
    </PageLayout>
  );
};
