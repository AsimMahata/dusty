import { useState } from 'react';
import { updateShowIdForShow as updateShowIdForShowIntrovert } from '../../../personalities/introverts/show/shows';
import { logger } from '../../../utility/logger';
import type { ShowResult } from "../types/types";

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
        setImdbId(show.show_id || null);
    }

    const updateImdbIdForShow = async (showId: string, newImdbId: string): Promise<boolean> => {
        try {
            await updateShowIdForShowIntrovert(showId, newImdbId);
            logger.info("Show ID updated successfully via IMDB", { id: showId, newImdbId });
            updateShowInState(showId, { show_id: newImdbId });
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
