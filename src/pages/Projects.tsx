import React, { useState, useEffect } from 'react';
import { CategoryPage } from '../components/CategoryPage';
import { ItemDetailPage, type ItemData } from '../components/ItemDetailPage';
import { PageLayout } from '../components/PageLayout';
import { mockData } from '../mockData';

let cachedProjectsData: { recent: ItemData[], all: ItemData[] } | null = null;

export const Projects: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<ItemData | null>(null);
  const [data, setData] = useState<{ recent: ItemData[], all: ItemData[] }>(cachedProjectsData || { recent: [], all: [] });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const newData = {
      recent: mockData.Projects.recent,
      all: mockData.Projects.all
    };
    
    cachedProjectsData = newData;
    setData(newData);
    setIsRefreshing(false);
  };

  useEffect(() => {
    if (!cachedProjectsData) {
      fetchData();
    }
  }, []);

  return (
    <PageLayout 
      title="Projects" 
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
          title="Projects" 
          recentItems={data.recent} 
          allItems={data.all} 
          searchQuery={searchQuery}
          onCardClick={setSelectedItem}
        />
      )}
    </PageLayout>
  );
};
