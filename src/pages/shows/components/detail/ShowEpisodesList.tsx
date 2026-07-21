import React from 'react';
import { NO_EPISODE_AVAILABLE_ICON, NO_EPISODE_AVAILABLE_P_TEXT } from '../../../../constants/icon';
import { EpisodeCard } from './EpisodeCard';
import type { Episode } from "../../../../types/media";

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
                    {NO_EPISODE_AVAILABLE_P_TEXT}
                </div>
            )}
        </div>
    );
};
