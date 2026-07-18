import React, { useState, useEffect, useMemo } from 'react';
import { type ShowResult, type ActionItem } from '../../../../../types/types';
import { getShowMetaData, getStatusColor, calculateProgressPercentage } from '../../../../../introverts/show/mal';
import type { ShowMetaData as ShowMetaDataInterface } from '../../../constants/constants';
import { ShowMetaData } from './ShowMetaData';
import { ShowPoster } from './ShowPoster';
import { ShowActions } from './ShowActions';
import { ShowProgress } from './ShowProgress';

interface ShowGridCardProps {
    show: ShowResult;
    onDoubleClick: (show: ShowResult) => void;
    actions: ActionItem[];
}

export const ShowGridCard: React.FC<ShowGridCardProps> = ({ show, onDoubleClick, actions }) => {
    const [meta, setMeta] = useState<ShowMetaDataInterface | null>(null);

    useEffect(() => {
        let mounted = true;
        getShowMetaData(show).then(data => {
            if (mounted) setMeta(data);
        });
        return () => { mounted = false; };
    }, [show]);

    const { posterUrl, rating, totalEpisodes, progress, statusColor } = useMemo(() => {
        return {
            posterUrl: meta?.posterUrl || '',
            rating: typeof meta?.rating === 'number' ? meta.rating : 0,
            totalEpisodes: meta?.totalEpisodes || show.num_episodes,
            progress: meta ? meta.progress : calculateProgressPercentage(show.episodes?.length || 0, show.num_episodes),
            statusColor: meta ? meta.statusColor : getStatusColor(show.status),
        };
    }, [meta, show]);

    return (
        <div className="show-grid-card" data-pinned={show.pinned ? 'true' : undefined} onDoubleClick={() => onDoubleClick(show)}>
            <div className="show-grid-image-container">
                <ShowPoster posterUrl={posterUrl} title={show.title} />
                <ShowActions actions={actions} />
                <ShowProgress progress={progress} statusColor={statusColor} />
            </div>

            <ShowMetaData 
                show={show} 
                statusColor={statusColor} 
                totalEpisodes={totalEpisodes} 
                rating={rating} 
            />
        </div>
    );
};

