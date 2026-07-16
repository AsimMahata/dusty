import React from 'react';
import { Play, Check, Pin, Star, Tv } from 'lucide-react';
import { type ShowResult, type ActionItem } from '../../../types/types';
import { 
    getDummyPosterUrl, 
    getDummyRating, 
    getDummyTotalEpisodes,
    getStatusColor,
    calculateProgressPercentage
} from './ShowHelpers';
import { ActionMenu } from '../../../components/ui/ActionMenu';

interface ShowGridCardProps {
    show: ShowResult;
    onDoubleClick: (show: ShowResult) => void;
    actions: ActionItem[];
}

export const ShowGridCard: React.FC<ShowGridCardProps> = ({ show, onDoubleClick, actions }) => {
    const posterUrl = getDummyPosterUrl(show.malNo);
    const rating = getDummyRating(show.malNo);
    const totalEpisodes = getDummyTotalEpisodes(show);
    const progress = calculateProgressPercentage(show.episodes?.length || 0, show.num_episodes);
    const statusColor = getStatusColor(show.status);

    const isWatching = show.status === 'watching';
    const isCompleted = show.status === 'completed';

    return (
        <div className="show-grid-card" data-pinned={show.pinned ? 'true' : undefined} onDoubleClick={() => onDoubleClick(show)}>
            <div className="show-grid-image-container">
                {posterUrl ? (
                    <img src={posterUrl} alt={show.title} className="show-grid-poster" />
                ) : (
                    <Tv className="show-grid-fallback-icon" size={48} />
                )}
                
                <div className="show-grid-actions-overlay">
                    <div className="show-grid-action-btn">
                        <ActionMenu actions={actions} />
                    </div>
                </div>

                <div className="show-grid-progress-bar-container">
                    <div 
                        className="show-grid-progress-bar" 
                        style={{ 
                            width: `${progress}%`, 
                            backgroundColor: statusColor 
                        }} 
                    />
                </div>
            </div>

            <div className="show-grid-content">
                <div className="show-grid-title" title={show.title}>
                    {show.title}
                    {show.pinned && <span className="show-pin-dot" title="Pinned" style={{ display: 'inline-block', verticalAlign: 'middle', marginBottom: '2px' }} />}
                </div>
                
                <div className="show-grid-meta">
                    <div className="show-grid-status">
                        <div className="show-grid-status-icon" style={{ color: statusColor }}>
                            {isWatching && <Play size={12} fill="currentColor" />}
                            {isCompleted && <Check size={12} />}
                            {!isWatching && !isCompleted && <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: statusColor }} />}
                        </div>
                        EP {show.episodes?.length || 0} / {totalEpisodes}
                    </div>
                    {rating > 0 && (
                        <div className="show-grid-rating">
                            <Star size={12} className="star-icon" /> {rating}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
