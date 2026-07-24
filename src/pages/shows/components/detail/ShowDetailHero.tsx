import React, { useState, useEffect, useMemo } from 'react';
import { PLAY_ICON_16_FILL, CALENDAR_ICON_14, STAR_ICON_16_CLASS, RADIO_ICON_14, CHEVRON_LEFT_ICON_24, TV_ICON_48_MUTED, CHECK_ICON_14 } from '../../../../constants/icon';
import { ActionMenu } from '../../../../components/ui/ActionMenu';
import { getShowMetaData, getStatusColor, calculateProgressPercentage, getNextEpisode } from '../../../../personalities/introverts/show/mal';
import type { ShowMetaData } from '../../types/types';
import type { ActionItem } from "../../../../types/core";
import type { ShowResult } from '../../types/types';

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
                {CHEVRON_LEFT_ICON_24} Back
            </button>

            <div className="show-detail-hero-content">
                <div className="show-detail-poster-container">
                    {posterUrl ? (
                        <img src={posterUrl} alt={show.title} className="show-detail-poster" />
                    ) : (
                        <div className="show-detail-poster-fallback">
                            {TV_ICON_48_MUTED}
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
                            {isWatching && PLAY_ICON_16_FILL}
                            {isCompleted && CHECK_ICON_14}
                            {!isWatching && !isCompleted && <div className="status-dot" style={{ backgroundColor: statusColor }} />}
                            <span style={{ textTransform: 'capitalize' }}>{show.status.replace('_', ' ')}</span>
                        </div>

                        {rating > 0 && (
                            <div className="show-detail-rating">
                                {STAR_ICON_16_CLASS} {rating}
                            </div>
                        )}

                        {seasonYear && (
                            <div className="show-detail-meta-item">
                                {CALENDAR_ICON_14} {seasonYear}
                            </div>
                        )}

                        {!seasonYear && isAiring && (
                            <div className="show-detail-meta-item">
                                {RADIO_ICON_14} Airing
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
