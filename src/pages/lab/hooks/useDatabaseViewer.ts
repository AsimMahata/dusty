import { useState, useCallback } from 'react';
import { getAllTableData } from '../../../personalities/introverts/lab/lab';

export const useDatabaseViewer = () => {
    const [data, setData] = useState<Record<string, any[]>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await getAllTableData();
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
