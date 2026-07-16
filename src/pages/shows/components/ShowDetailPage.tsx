import React, { useEffect, useState } from 'react';
import { Play, Check, ChevronLeft, Calendar, ListVideo, Folder, Star, Radio, Clock, Tv } from 'lucide-react';
import type { ShowResult, ActionItem, Item } from '../../../types/types';
import { 
    getDummyPosterUrl, 
    getDummyRating, 
    getDummyTotalEpisodes, 
    getDummyNextEpisode, 
    getDummySeasonYear, 
    getStatusColor,
    calculateProgressPercentage,
    getShowBanner
} from './ShowHelpers';
import { ActionMenu } from '../../../components/ui/ActionMenu';
import { getChildrens, openEpisode } from '../utility';
import './ShowDetailPage.css';

interface ShowDetailPageProps {
    show: ShowResult;
    onBack: () => void;
    actions: ActionItem[];
    filteredShows: ShowResult[]; // For getChildrens logic
}

export const ShowDetailPage: React.FC<ShowDetailPageProps> = ({ show, onBack, actions, filteredShows }) => {
    const [episodes, setEpisodes] = useState<Item[]>([]);
    
    useEffect(() => {
        const loadEpisodes = async () => {
            // Reusing existing episode loading logic from utility.ts
            const itemCollection = { id: show.id, title: show.title, subtitle: '', is_dir: true };
            const eps = await getChildrens(itemCollection, filteredShows);
            setEpisodes(eps);
        };
        loadEpisodes();
    }, [show, filteredShows]);

    const bannerUrl = getShowBanner(show);
    const posterUrl = getDummyPosterUrl(show.malNo);
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
        <div className="show-detail-page">
            {/* Hero Section */}
            <div className="show-detail-hero">
                <div 
                    className="show-detail-banner" 
                    style={{ backgroundImage: bannerUrl ? `url(${bannerUrl})` : 'none' }}
                >
                    <div className="show-detail-banner-overlay" />
                </div>
                
                <button className="show-detail-back-btn" onClick={onBack}>
                    <ChevronLeft size={24} /> Back
                </button>

                <div className="show-detail-hero-content">
                    <div className="show-detail-poster-container">
                        {posterUrl ? (
                            <img src={posterUrl} alt={show.title} className="show-detail-poster" />
                        ) : (
                            <div className="show-detail-poster-fallback">
                                <Tv size={48} color="var(--text-muted)" />
                            </div>
                        )}
                    </div>
                    
                    <div className="show-detail-info">
                        <div className="show-detail-title-row">
                            <h1 className="show-detail-title">{show.title}</h1>
                            <div className="show-detail-actions">
                                <ActionMenu actions={actions} />
                            </div>
                        </div>
                        {show.get_title && show.get_title !== show.title && (
                            <h2 className="show-detail-subtitle">{show.get_title}</h2>
                        )}

                        <div className="show-detail-meta-row">
                            <div className="show-detail-status" style={{ color: statusColor, borderColor: statusColor }}>
                                {isWatching && <Play size={14} fill="currentColor" />}
                                {isCompleted && <Check size={14} />}
                                {!isWatching && !isCompleted && <div className="status-dot" style={{ backgroundColor: statusColor }} />}
                                <span style={{ textTransform: 'capitalize' }}>{show.status.replace('_', ' ')}</span>
                            </div>
                            
                            {rating > 0 && (
                                <div className="show-detail-rating">
                                    <Star size={16} className="star-icon" /> {rating}
                                </div>
                            )}

                            {seasonYear && (
                                <div className="show-detail-meta-item">
                                    <Calendar size={14} /> {seasonYear}
                                </div>
                            )}
                            
                            {!seasonYear && isAiring && (
                                <div className="show-detail-meta-item">
                                    <Radio size={14} /> Airing
                                </div>
                            )}
                        </div>

                        <div className="show-detail-progress-section">
                            <div className="show-detail-progress-bar-container">
                                <div 
                                    className="show-detail-progress-bar" 
                                    style={{ 
                                        width: `${progress}%`, 
                                        backgroundColor: statusColor 
                                    }} 
                                />
                            </div>
                            <div className="show-detail-progress-text">
                                <span className="show-detail-progress-episodes">
                                    EP {show.episodes?.length || 0} / {totalEpisodes}
                                </span>
                                <span className="show-detail-progress-percentage" style={{ color: statusColor }}>
                                    {progress}%
                                </span>
                            </div>
                        </div>
                        
                        {isWatching && nextEpisode && rating > 0 && (
                            <div className="show-detail-next-ep">
                                Next Up: Episode {nextEpisode}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Episodes Section */}
            <div className="show-detail-episodes-section">
                <h3 className="show-detail-section-title">Episodes</h3>
                {episodes.length > 0 ? (
                    <div className="show-detail-episodes-list">
                        {episodes.map(ep => (
                            <div 
                                key={ep.id} 
                                className="show-detail-episode-item"
                                onClick={() => openEpisode(ep)}
                            >
                                <div className="show-detail-episode-icon">
                                    <Play size={18} />
                                </div>
                                <div className="show-detail-episode-info">
                                    <div className="show-detail-episode-title">{ep.title}</div>
                                    <div className="show-detail-episode-path">{ep.path}</div>
                                </div>
                                <div className="show-detail-episode-size">
                                    {ep.size}
                                </div>
                                <div className="show-detail-episode-actions" onClick={e => e.stopPropagation()}>
                                    <ActionMenu actions={[
                                        { label: 'Open', color: 'var(--accent)', onClick: () => openEpisode(ep) },
                                        { label: 'Copy Path', onClick: () => ep.path && navigator.clipboard.writeText(ep.path) },
                                        { label: 'Copy File Name', onClick: () => ep.title && navigator.clipboard.writeText(ep.title) }
                                    ]} />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="show-detail-no-episodes">
                        <Folder size={48} color="var(--text-muted)" />
                        <p>No episodes found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
