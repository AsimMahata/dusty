import React from 'react';
import { ActionMenu } from '../../../../components/ui/ActionMenu';
import { getEpisodeActions } from '../../actions/utility';
import { EPISODE_PLAY_ICON_18 } from '../../../../constants/icon';
import { EpisodeInfo } from './EpisodeInfo';
import type { Episode } from "../../../../types/media";

interface EpisodeCardProps {
    episode: Episode;
    onEpisodeClick: (episode: Episode) => void;
}

export const EpisodeCard: React.FC<EpisodeCardProps> = ({ episode, onEpisodeClick }) => {

    return (
        <div
            className="show-detail-episode-item"
            onClick={() => onEpisodeClick(episode)}
        >
            <div className="show-detail-episode-icon">
                {EPISODE_PLAY_ICON_18}
            </div>
            <EpisodeInfo episode={episode} />
            <div className="show-detail-episode-actions" onClick={e => e.stopPropagation()}>
                <ActionMenu actions={getEpisodeActions(episode)} />
            </div>
        </div>
    );
};
