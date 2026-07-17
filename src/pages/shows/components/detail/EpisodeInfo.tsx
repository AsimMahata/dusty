import React from 'react';
import type { Episode } from '../../../../types/types';

interface EpisodeInfoProps {
    episode: Episode;
}

export const EpisodeInfo: React.FC<EpisodeInfoProps> = ({ episode }) => {
    return (
        <>
            <div className="show-detail-episode-info">
                <div className="show-detail-episode-title">{episode.title}</div>
                <div className="show-detail-episode-path">{episode.path}</div>
            </div>
            <div className="show-detail-episode-size">
                {episode.size}
            </div>
        </>
    );
};
