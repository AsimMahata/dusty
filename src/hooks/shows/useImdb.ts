import { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { CMD_UPDATE_IMDB_ID } from '../../constants/commands';
import type { ShowResult } from '../../types/types';
import { logger } from '../../utility/logger';

interface UseImdbProps {
    updateShowInState: (showId: string, updates: Partial<ShowResult>) => void;
}

export const useImdb = ({ updateShowInState }: UseImdbProps) => {
    const [showEditImdbId, setShowEditImdbId] = useState(false);
    const [currentEditShowImdb, setCurrentEditShowImdb] = useState<ShowResult | null>(null);
    const [imdbId, setImdbId] = useState<string | null>(null);
    
    const handleEditImdbId = (show: ShowResult) => {
        setShowEditImdbId(true);
        setCurrentEditShowImdb(show);
        setImdbId(show.imdb_id || null);
    }
    
    const updateImdbIdForShow = async (showId: string, newImdbId: string): Promise<boolean> => {
        try {
            await invoke(CMD_UPDATE_IMDB_ID, {
                id: showId,
                imdbId: newImdbId
            });
            logger.info("IMDB ID updated successfully", { id: showId, newImdbId });
            updateShowInState(showId, { imdb_id: newImdbId });
            return true;
        } catch (err) {
            logger.error(`Failed to update imdb id for show ${showId}: ${String(err)}`);
            return false;
        }
    }
    
    const handleSaveImdbId = async () => {
        if (currentEditShowImdb && imdbId) {
            await updateImdbIdForShow(currentEditShowImdb.id, imdbId);
        }
        setShowEditImdbId(false);
        setCurrentEditShowImdb(null);
        setImdbId(null);
    }
    
    const handleCancelEditImdbId = () => {
        setShowEditImdbId(false);
        setCurrentEditShowImdb(null);
        setImdbId(null);
    }

    return {
        showEditImdbId,
        currentEditShowImdb,
        imdbId,
        setImdbId,
        handleEditImdbId,
        handleSaveImdbId,
        handleCancelEditImdbId,
        updateImdbIdForShow,
    };
};
