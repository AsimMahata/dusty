import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Plus, Minus } from 'lucide-react';
import { PLAY_ICON_16_FILL, CALENDAR_ICON_14, STAR_ICON_16_CLASS, RADIO_ICON_14, CHEVRON_LEFT_ICON_24, TV_ICON_48_MUTED, CHECK_ICON_14 } from '../../../../constants/icon';
import { ActionMenu } from '../../../../components/ui/ActionMenu';
import { getShowMetaData, getStatusColor, calculateProgressPercentage, getNextEpisode } from '../../../../personalities/introverts/show/metadata';
import type { ShowMetaData } from '../../types/types';
import type { ActionItem } from "../../../../types/core";
import type { ShowResult } from '../../types/types';

interface ShowDetailHeroProps {
    show: ShowResult;
    getActionsForShow: (show: ShowResult) => ActionItem[];
    onBack: () => void;
    onUpdateEpisodesWatched?: (episodesWatched: number) => Promise<boolean> | void;
}

export const ShowDetailHero: React.FC<ShowDetailHeroProps> = ({ show, getActionsForShow, onBack, onUpdateEpisodesWatched }) => {
    const [meta, setMeta] = useState<ShowMetaData | null>(null);

    const [watchedCount, setWatchedCount] = useState<number>(show.episodes_watched || 0);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editValue, setEditValue] = useState<string>('');
    const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        setWatchedCount(show.episodes_watched || 0);
    }, [show.episodes_watched]);

    useEffect(() => {
        let mounted = true;
        getShowMetaData(show).then(data => {
            if (mounted) setMeta(data);
        });
        return () => { mounted = false; };
    }, [show]);

    const { bannerUrl, posterUrl, rating, totalEpisodes, nextEpisode, seasonYear, statusColor } = useMemo(() => {
        return {
            bannerUrl: meta?.bannerUrl || '',
            posterUrl: meta?.posterUrl || '',
            rating: typeof meta?.rating === 'number' ? meta.rating : 0,
            totalEpisodes: meta?.totalEpisodes || show.num_episodes,
            nextEpisode: meta ? meta.nextEpisode : getNextEpisode(show),
            seasonYear: meta?.seasonYear || '',
            statusColor: meta ? meta.statusColor : getStatusColor(show.status),
        };
    }, [meta, show]);

    const dynamicProgress = calculateProgressPercentage(
        watchedCount,
        typeof totalEpisodes === 'number' && totalEpisodes > 0 ? totalEpisodes : (show.num_episodes || 0)
    );

    const hasKnownTotal = typeof totalEpisodes === 'number' && totalEpisodes > 0;
    const totalEpisodesDisplay = hasKnownTotal ? totalEpisodes : '?';
    const displayProgressText = hasKnownTotal ? `${dynamicProgress}%` : '?';

    const isWatching = show.status === 'watching';
    const isCompleted = show.status === 'completed';
    const isAiring = !isCompleted && (!hasKnownTotal || show.num_episodes === 0);

    const isMaxReached = hasKnownTotal && watchedCount >= totalEpisodes;

    const saveToDbDebounced = (newCount: number) => {
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }
        debounceTimerRef.current = setTimeout(() => {
            if (onUpdateEpisodesWatched) {
                void onUpdateEpisodesWatched(newCount);
            }
        }, 350);
    };

    const handleIncrement = () => {
        const max = typeof totalEpisodes === 'number' && totalEpisodes > 0 ? totalEpisodes : Infinity;
        if (watchedCount >= max) return;
        const next = watchedCount + 1;
        setWatchedCount(next);
        saveToDbDebounced(next);
    };

    const handleDecrement = () => {
        if (watchedCount <= 0) return;
        const next = watchedCount - 1;
        setWatchedCount(next);
        saveToDbDebounced(next);
    };

    const handleCommitInput = () => {
        setIsEditing(false);
        let val = parseInt(editValue, 10);
        if (isNaN(val) || val < 0) val = 0;
        const max = typeof totalEpisodes === 'number' && totalEpisodes > 0 ? totalEpisodes : null;
        if (max !== null && val > max) val = max;

        setWatchedCount(val);
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }
        if (onUpdateEpisodesWatched) {
            void onUpdateEpisodesWatched(val);
        }
    };

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
                                    width: `${dynamicProgress}%`,
                                    backgroundColor: statusColor
                                }}
                            />
                        </div>
                        <div className="show-detail-progress-text">
                            <div className="show-detail-episodes-control">
                                <button
                                    className="show-detail-ep-btn decrement"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDecrement();
                                    }}
                                    disabled={watchedCount <= 0}
                                    title="Decrease watched episode"
                                >
                                    <Minus size={13} />
                                </button>

                                {isEditing ? (
                                    <input
                                        type="number"
                                        className="show-detail-ep-input"
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
                                        onBlur={handleCommitInput}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleCommitInput();
                                            if (e.key === 'Escape') setIsEditing(false);
                                        }}
                                        autoFocus
                                        min={0}
                                        max={typeof totalEpisodes === 'number' && totalEpisodes > 0 ? totalEpisodes : undefined}
                                    />
                                ) : (
                                    <span
                                        className="show-detail-ep-number"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setEditValue(watchedCount.toString());
                                            setIsEditing(true);
                                        }}
                                        title="Click to edit watched episode count directly"
                                    >
                                        EP {watchedCount}
                                    </span>
                                )}

                                <span className="show-detail-ep-total">/ {totalEpisodesDisplay}</span>

                                <button
                                    className="show-detail-ep-btn increment"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleIncrement();
                                    }}
                                    disabled={isMaxReached}
                                    title="Increase watched episode"
                                >
                                    <Plus size={13} />
                                </button>
                            </div>
                            <span className="show-detail-progress-percentage" style={{ color: statusColor }}>
                                {displayProgressText}
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
