import { NO_EPISODE_AVAILABLE_ICON } from '../../constants/constants';
import React from 'react';

import { EpisodeCard } from './EpisodeCard';
import type { Episode } from "../../../../components/media/types/types";

interface ShowEpisodesListProps {
    episodes: Episode[];
    onEpisodeClick: (episode: Episode) => void;
}

export const ShowEpisodesList: React.FC<ShowEpisodesListProps> = ({ episodes, onEpisodeClick }) => {
    return (
        <div className="show-detail-episodes-section">
            <h3 className="show-detail-section-title">Episodes</h3>
            {episodes.length > 0 ? (
                <div className="show-detail-episodes-list">
                    {episodes.map(ep => (
                        <EpisodeCard key={ep.id} episode={ep} onEpisodeClick={onEpisodeClick} />
                    ))}
                </div>
            ) : (
                <div className="show-detail-no-episodes">
                    {NO_EPISODE_AVAILABLE_ICON}
                    <p>No episodes found.</p>
                </div>
            )}
        </div>
    );
};
