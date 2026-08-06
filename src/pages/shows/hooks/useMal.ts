import { useState } from 'react';
import { updateShowIdForShow as updateShowIdForShowIntrovert } from '../../../personalities/introverts/show/shows';
import { logger } from '../../../utility/logger';
import type { ShowResult } from "../types/types";

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
        setMalNumber(show.show_id ? parseInt(show.show_id, 10) : null);
    }

    const updateMalIdForShow = async (showId: string, newMalId: string | number): Promise<boolean> => {
        try {
            const externalIdStr = String(newMalId);
            await updateShowIdForShowIntrovert(showId, externalIdStr);
            logger.info("Show ID updated successfully via MAL", { id: showId, externalIdStr });
            updateShowInState(showId, { show_id: externalIdStr });
            return true;
        } catch (err) {
            logger.error(`Failed to update show id for ${showId}: ${String(err)}`);
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
