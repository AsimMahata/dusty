import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { CategoryPage } from '../../components/CategoryPage';
import type { ItemData } from '../../components/ItemDetailPage';
import type { FileInfo } from '../../types/types';
import { fileInfoToItemData } from '../../utility/util';

let cachedEmptyDirData: ItemData[] | null = null;

interface EmptyDirProps {
  searchQuery: string;
  refreshTrigger: number;
  onRefreshingChange: (isRefreshing: boolean, isLoading: boolean) => void;
}

export const EmptyDir: React.FC<EmptyDirProps> = ({ 
  searchQuery, 
  refreshTrigger, 
  onRefreshingChange
}) => {
  const [data, setData] = useState<ItemData[]>(cachedEmptyDirData || []);

  const fetchData = async () => {
    onRefreshingChange(true, data.length === 0);
    try {
      const dirs: FileInfo[] = await invoke('scan_empty_dir');
      const items = fileInfoToItemData(dirs);
      cachedEmptyDirData = items;
      setData(items);
    } catch (error) {
      console.error("Failed to fetch empty directories:", error);
    } finally {
      onRefreshingChange(false, false);
    }
  };

  useEffect(() => {
    if (!cachedEmptyDirData) {
      fetchData();
    }
  }, []);

  useEffect(() => {
    if (refreshTrigger > 0) {
      fetchData();
    }
  }, [refreshTrigger]);

  return (
    <CategoryPage 
      title="Empty Directories" 
      recentItems={[]} 
      allItems={data} 
      searchQuery={searchQuery}
    />
  );
};
