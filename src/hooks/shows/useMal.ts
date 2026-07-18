import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { CMD_UPDATE_MAL_ID } from '../../constants/commands';
import type { ShowResult } from '../../types/types';
import { logger } from '../../utility/logger';
import { getAnimeInfoFromMal } from '../../introverts/show/mal';

interface UseMalProps {
    allShows: ShowResult[];
    updateShowInState: (showId: string, updates: Partial<ShowResult>) => void;
}

export const useMal = ({ allShows, updateShowInState }: UseMalProps) => {
    const [showEditMalId, setShowEditMalId] = useState(false);
    const [currentEditShow, setCurrentEditShow] = useState<ShowResult | null>(null);
    const [malNumber, setMalNumber] = useState<number | null>(null);
    
    const handleEditMalId = (show: ShowResult) => {
        setShowEditMalId(true);
        setCurrentEditShow(show);
        setMalNumber(show.malId || null);
    }
    
    const handleSaveMalId = async () => {
        if (currentEditShow && malNumber) {
            try {
                await invoke(CMD_UPDATE_MAL_ID, {
                    id: currentEditShow.id,
                    malId: malNumber
                });
                logger.info("MAL ID updated successfully", { id: currentEditShow.id, newMalId: malNumber });
            } catch (err) {
                logger.error(`Failed to update mal id for show ${currentEditShow.id}: ${String(err)}`);
                return;
            }
            updateShowInState(currentEditShow.id, { malId: malNumber });
        }
        setShowEditMalId(false);
        setCurrentEditShow(null);
        setMalNumber(null);
    }
    
    const handleCancelEditMalId = () => {
        setShowEditMalId(false);
        setCurrentEditShow(null);
        setMalNumber(null);
    }

    return {
        showEditMalId,
        currentEditShow,
        malNumber,
        setMalNumber,
        handleEditMalId,
        handleSaveMalId,
        handleCancelEditMalId,
    };
};
