import { useState } from 'react';
import { updateMalIdForShow as updateMalIdForShowIntrovert } from '../../personalities/introverts/show/shows';
import { logger } from '../../utility/logger';
import type { ShowResult } from "../../types/shows";

interface UseMalProps {
    updateShowInState: (showId: string, updates: Partial<ShowResult>) => void;
}

export const useMal = ({ updateShowInState }: UseMalProps) => {
    const [showEditMalId, setShowEditMalId] = useState(false);
    const [currentEditShow, setCurrentEditShow] = useState<ShowResult | null>(null);
    const [malNumber, setMalNumber] = useState<number | null>(null);
    
    const handleEditMalId = (show: ShowResult) => {
        setShowEditMalId(true);
        setCurrentEditShow(show);
        setMalNumber(show.mal_id || null);
    }
    
    const updateMalIdForShow = async (showId: string, newMalId: number): Promise<boolean> => {
        try {
            await updateMalIdForShowIntrovert(showId, newMalId);
            logger.info("MAL ID updated successfully", { id: showId, newMalId });
            updateShowInState(showId, { mal_id: newMalId });
            return true;
        } catch (err) {
            logger.error(`Failed to update mal id for show ${showId}: ${String(err)}`);
            return false;
        }
    }
    
    const handleSaveMalId = async () => {
        if (currentEditShow && malNumber) {
            await updateMalIdForShow(currentEditShow.id, malNumber);
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
        updateMalIdForShow,
    };
};
