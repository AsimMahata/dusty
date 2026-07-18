import { useState, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';

export const useDatabaseViewer = () => {
    const [data, setData] = useState<Record<string, any[]>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await invoke<Record<string, any[]>>('get_all_table_data');
            setData(result);
        } catch (err) {
            setError(String(err));
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        data,
        isLoading,
        error,
        fetchData
    };
};
