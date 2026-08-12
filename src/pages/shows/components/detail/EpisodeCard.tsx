import { EPISODE_PLAY_ICON_18 } from '../../constants/constants';
import React from 'react';
import { ActionMenu } from '../../../../components/ui/ActionMenu';
import { getEpisodeActions } from '../../actions/utility';

import { EpisodeInfo } from './EpisodeInfo';
import type { Episode } from "../../../../components/media/types/types";
import { useFileActions } from '../../../../hooks/useFileActions';

interface EpisodeCardProps {
    episode: Episode;
    onEpisodeClick: (episode: Episode) => void;
}

export const EpisodeCard: React.FC<EpisodeCardProps> = ({ episode, onEpisodeClick }) => {
    const fileActions = useFileActions();

    const actions = episode.path
        ? fileActions.getFileActions({ path: episode.path, name: episode.title })
        : getEpisodeActions(episode);

    return (
        <>
            <div
                className="show-detail-episode-item"
                onClick={() => onEpisodeClick(episode)}
            >
                <div className="show-detail-episode-icon">
                    {EPISODE_PLAY_ICON_18}
                </div>
                <EpisodeInfo episode={episode} />
                <div className="show-detail-episode-actions" onClick={e => e.stopPropagation()}>
                    <ActionMenu actions={actions} />
                </div>
            </div>
            {fileActions.renderFileModals()}
        </>
    );
};

