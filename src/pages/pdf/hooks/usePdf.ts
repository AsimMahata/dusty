import { useState, useEffect } from 'react';
import type { Chunk } from '../../../components/bazar/types/types';
import { useCommon } from '../../../hooks/useCommon';
import type { MiscDir } from '../../misc/types/types';
import { scanPdf, scanPdfTree } from '../../../personalities/introverts/pdf/scan';
import { logger } from '../../../utility/logger';
import { openFile } from '../../../personalities/introverts/filesystem/filesystem';
import type { FileInfo } from '../../../types/core';

const fileInfoToChunk = (file: FileInfo): Chunk => ({
    id: file.id,
    name: file.name,
    path: file.path,
    ext: file.ext,
    size: file.size,
    is_pinned: false,
});

export const usePdf = () => {
    const { searchQuery, setSearchQuery, isRefreshing, setIsRefreshing, isLoading, setIsLoading } = useCommon();
    const [chunks, setChunks] = useState<Chunk[]>([]);
    const [pdfTree, setPdfTree] = useState<MiscDir[]>([]);
    const [currentDirHistory, setCurrentDirHistory] = useState<MiscDir[]>([]);

    const currentDir = currentDirHistory.length > 0 ? currentDirHistory[currentDirHistory.length - 1] : null;

    const handleFolderClick = (folder: MiscDir) => {
        setCurrentDirHistory(prev => [...prev, folder]);
    };

    const goBack = () => {
        if (currentDirHistory.length > 0) {
            setCurrentDirHistory(prev => prev.slice(0, -1));
        }
    };

    const fetchData = async (sync: boolean = false) => {
        if (sync) {
            setIsRefreshing(true);
        } else {
            setIsLoading(true);
        }

        try {
            const [files, tree] = await Promise.all([
                scanPdf(sync),
                scanPdfTree(sync)
            ]);
            const newChunks = files.map(fileInfoToChunk);
            setChunks(newChunks);
            setPdfTree(tree);
            setCurrentDirHistory([]);
            logger.info('pdf chunks and tree fetched', newChunks.length);
        } catch (err) {
            logger.error(`Pdf: failed to fetch chunks: ${String(err)}`);
        } finally {
            setIsRefreshing(false);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData(false);
    }, []);

    const openChunk = async (chunk: Chunk) => {
        try {
            await openFile(chunk.path);
        } catch (err) {
            logger.error(`Pdf: failed to open ${chunk.name}: ${String(err)}`);
        }
    };

    const togglePin = (id: string) => {
        setChunks(prev => prev.map(c =>
            c.id === id ? { ...c, is_pinned: !c.is_pinned } : c
        ));
    };

    return {
        title: 'PDF',
        searchQuery, setSearchQuery,
        isRefreshing, isLoading,
        fetchData,
        chunks,
        pdfTree,
        currentDir,
        currentDirHistory,
        handleFolderClick,
        goBack,
        canGoBack: currentDirHistory.length > 0,
        openChunk,
        togglePin,
    };
};
