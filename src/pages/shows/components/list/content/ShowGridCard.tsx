import React from 'react';
import { Play, Check, Star, Tv } from 'lucide-react';
import { type ShowResult, type ActionItem } from '../../../../../types/types';
import { 
    getDummyPosterUrl, 
    getDummyRating, 
    getDummyTotalEpisodes,
    getStatusColor,
    calculateProgressPercentage,
    getShowMetaData
} from '../../../actions/info';
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
    const {posterUrl,rating,totalEpisodes,progress,statusColor} = getShowMetaData(show);

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

