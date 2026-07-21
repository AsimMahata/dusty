import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, Tv, Play, Check, Star, Calendar, Radio } from 'lucide-react';
import { ActionMenu } from '../../../../components/ui/ActionMenu';
import { getShowMetaData, getStatusColor, calculateProgressPercentage, getNextEpisode } from '../../../../personalities/introverts/show/mal';
import type { ShowMetaData } from "../../../../types/shows";
import type { ActionItem } from "../../../../types/core";
import type { ShowResult } from "../../../../types/shows";

interface ShowDetailHeroProps {
    show: ShowResult;
    getActionsForShow: (show: ShowResult) => ActionItem[];
    onBack: () => void;
}

export const ShowDetailHero: React.FC<ShowDetailHeroProps> = ({ show, getActionsForShow, onBack }) => {
    const [meta, setMeta] = useState<ShowMetaData | null>(null);

    useEffect(() => {
        let mounted = true;
        getShowMetaData(show).then(data => {
            if (mounted) setMeta(data);
        });
        return () => { mounted = false; };
    }, [show]);

    const { bannerUrl, posterUrl, rating, totalEpisodes, nextEpisode, seasonYear, progress, statusColor } = useMemo(() => {
        return {
            bannerUrl: meta?.bannerUrl || '',
            posterUrl: meta?.posterUrl || '',
            rating: typeof meta?.rating === 'number' ? meta.rating : 0,
            totalEpisodes: meta?.totalEpisodes || show.num_episodes,
            nextEpisode: meta ? meta.nextEpisode : getNextEpisode(show),
            seasonYear: meta?.seasonYear || '',
            progress: meta ? meta.progress : calculateProgressPercentage(show.episodes?.length || 0, show.num_episodes),
            statusColor: meta ? meta.statusColor : getStatusColor(show.status),
        };
    }, [meta, show]);

    const isWatching = show.status === 'watching';
    const isCompleted = show.status === 'completed';
    const isAiring = !isCompleted && show.num_episodes === 0;

    return (
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
                            <ActionMenu actions={getActionsForShow(show)} />
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
    );
};
