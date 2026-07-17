import React from 'react';
import { SHOW_PAGE_FALLBACK_ICON } from '../../../../../constants/icon';

interface ShowPosterProps {
    posterUrl: string | undefined;
    title: string;
}

export const ShowPoster: React.FC<ShowPosterProps> = ({ posterUrl, title }) => {
    return (
        <>
            {posterUrl ? (
                <img src={posterUrl} alt={title} className="show-grid-poster" />
            ) : (
                SHOW_PAGE_FALLBACK_ICON
            )}
        </>
    );
};
