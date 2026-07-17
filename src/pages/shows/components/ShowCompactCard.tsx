import React from 'react';
import { Play, Check, Calendar, ListVideo, Folder, Star, Radio, Clock, Tv } from 'lucide-react';
import { type ShowResult, type ActionItem } from '../../../types/types';
import { 
    getDummyRating, 
    getDummyTotalEpisodes, 
    getDummyNextEpisode, 
    getDummySeasonYear, 
    getStatusColor,
    calculateProgressPercentage
} from './ShowHelpers';
import { ActionMenu } from '../../../components/ui/ActionMenu';

interface ShowCompactCardProps {
    show: ShowResult;
    onDoubleClick: (show: ShowResult) => void;
    actions: ActionItem[];
}

export const ShowCompactCard: React.FC<ShowCompactCardProps> = ({ show, onDoubleClick, actions }) => {
    
    const rating = getDummyRating(show.malNo);
    const totalEpisodes = getDummyTotalEpisodes(show);
    const nextEpisode = getDummyNextEpisode(show);
    const seasonYear = getDummySeasonYear(show.malNo);
    const progress = calculateProgressPercentage(show.episodes?.length || 0, show.num_episodes);
    const statusColor = getStatusColor(show.status);

    const isWatching = show.status === 'watching';
    const isCompleted = show.status === 'completed';
    const isAiring = !isCompleted && show.num_episodes === 0;

    return (
        <div className="show-card compact" data-pinned={show.pinned ? 'true' : undefined} onDoubleClick={() => onDoubleClick(show)}>
            <div className="show-card-image-container">
                <Tv className="show-card-fallback-icon" />
            </div>

            <div className="show-card-content">
                <div className="show-card-header">
                    <div className="show-card-title-group">
                        <div className="show-card-title">
                            <div className="show-status-icon">
                                {isWatching && <Play size={14} color={statusColor} fill={statusColor} />}
                                {isCompleted && <Check size={14} color={statusColor} />}
                                {!isWatching && !isCompleted && <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: statusColor }} />}
                            </div>
                            {show.title}
                            {show.pinned && <span className="show-pin-dot" title="Pinned" />}
                        </div>
                        {show.get_title && show.get_title !== show.title && (
                            <div className="show-card-subtitle">{show.get_title}</div>
                        )}
                    </div>
                </div>

                <div className="show-card-progress-section">
                    <div className="show-card-progress-bar-container">
                        <div 
                            className="show-card-progress-bar" 
                            style={{ 
                                width: `${progress}%`, 
                                backgroundColor: statusColor 
                            }} 
                        />
                    </div>
                    <div className="show-card-progress-text">
                        <span className="show-card-progress-episodes">
                            EP {show.episodes?.length || 0} / {totalEpisodes}
                        </span>
                        <span className="show-card-progress-percentage" style={{ color: statusColor }}>
                            {progress}%
                        </span>
                    </div>
                </div>

                <div className="show-card-footer">
                    <div className="show-card-meta">
                        {seasonYear && (
                            <div className="show-card-meta-item">
                                <Calendar size={14} /> {seasonYear}
                            </div>
                        )}
                        {!seasonYear && isAiring && (
                            <div className="show-card-meta-item">
                                <Radio size={14} /> Airing
                            </div>
                        )}
                        <div className="show-card-meta-item">
                            <ListVideo size={14} /> {totalEpisodes} Episodes
                        </div>
                        {isCompleted ? (
                            <div className="show-card-meta-item">
                                <Check size={14} /> Finished
                            </div>
                        ) : (
                            show.dir ? (
                                <div className="show-card-meta-item">
                                    <Folder size={14} /> 1 Folder
                                </div>
                            ) : (
                                <div className="show-card-meta-item">
                                    <Clock size={14} /> Last watched Yesterday
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>

            <div className="show-card-actions">
                <div className="show-card-meta-item" style={{ marginRight: '1rem' }}>
                    {rating > 0 && (
                        <div className="show-card-rating">
                            <Star size={16} className="star-icon" /> {rating}
                        </div>
                    )}
                </div>
                {isWatching && nextEpisode && rating > 0 && (
                    <div className="show-card-next-ep" style={{ marginRight: '1rem' }}>
                        Next: EP {nextEpisode}
                    </div>
                )}
                <div className="show-card-action-btn" title="More options">
                    <ActionMenu actions={actions} />
                </div>
            </div>
            {isCompleted && (
                 <div style={{position: 'absolute', right: '4rem', bottom: '1.2rem', color: statusColor, display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', fontWeight: 500}}>
                     Completed <Check size={16} color={statusColor}/>
                 </div>
            )}
        </div>
    );
};
