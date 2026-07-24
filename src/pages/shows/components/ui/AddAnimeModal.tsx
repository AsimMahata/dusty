import React, { useState, useEffect, useRef } from 'react';
import { X_ICON_20, SEARCH_ICON_18, CHECK_ICON_18, PLUS_ICON_18 } from '../../../../constants/icon';
import { searchAnime, saveSelectedAnime } from '../../../../personalities/introverts/show/anime';
import type { AnimeData } from '../../types/types';
import { COLORS } from '../../../../constants/color';

interface AddAnimeModalProps {
    onClose: () => void;
    initialQuery?: string;
    targetShowId?: string;
    onLinkAction?: (showId: string, malId: number) => Promise<boolean>;
}

export const AddAnimeModal: React.FC<AddAnimeModalProps> = ({ onClose, initialQuery = '', targetShowId, onLinkAction }) => {
    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [searchResults, setSearchResults] = useState<AnimeData[]>([]);
    const [selectedAnime, setSelectedAnime] = useState<AnimeData[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    useEffect(() => {
        const handler = setTimeout(async () => {
            const query = searchQuery.trim();
            if (query.length >= 3) {
                setIsSearching(true);
                setStatusMessage(null);
                const results = await searchAnime(query);
                setSearchResults(results);
                setIsSearching(false);
            } else {
                setSearchResults([]);
            }
        }, 500);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    const toggleSelection = (anime: AnimeData) => {
        setSelectedAnime(prev =>
            prev.some(a => a.mal_id === anime.mal_id)
                ? prev.filter(a => a.mal_id !== anime.mal_id)
                : [...prev, anime]
        );
        setStatusMessage(null);
    };

    const handleSubmit = async () => {
        if (selectedAnime.length === 0) return;
        setIsSubmitting(true);
        setStatusMessage(null);

        const success = await saveSelectedAnime(selectedAnime);
        setIsSubmitting(false);

        if (success) {
            setStatusMessage({ type: 'success', text: 'Successfully added anime!' });
            setSelectedAnime([]);
            setTimeout(() => {
                onClose();
            }, 1500);
        } else {
            setStatusMessage({ type: 'error', text: 'Unsuccessful in adding anime.' });
        }
    };

    const handleLinkToMAL = async (anime: AnimeData) => {
        if (!targetShowId || !onLinkAction) return;
        setIsSubmitting(true);
        setStatusMessage(null);

        // Add to DB first so it is cached
        await saveSelectedAnime([anime]);

        try {
            const success = await onLinkAction(targetShowId, anime.mal_id);
            if (success) {
                setStatusMessage({ type: 'success', text: 'Linked successfully!' });
                setTimeout(() => {
                    onClose();
                }, 1500);
            } else {
                setStatusMessage({ type: 'error', text: 'Failed to link show.' });
                setIsSubmitting(false);
            }
        } catch (error) {
            setStatusMessage({ type: 'error', text: 'Failed to link show.' });
            setIsSubmitting(false);
        }
    };

    return (
        <div className="add-anime-modal-overlay" onClick={onClose}>
            <div className="add-anime-modal-content" onClick={e => e.stopPropagation()}>
                <div className="add-anime-modal-header">
                    <h2>{targetShowId ? 'Link Anime to MAL' : 'Add Anime'}</h2>
                    <button className="add-anime-close-btn" onClick={onClose}>
                        {X_ICON_20}
                    </button>
                </div>

                <div className="add-anime-modal-body">
                    <div className="add-anime-search-container">
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Search for anime..."
                            className="add-anime-search-input"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button className="add-anime-search-btn">
                            {SEARCH_ICON_18}
                        </button>
                    </div>

                    <div className="add-anime-list">
                        {isSearching ? (
                            <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Searching...</div>
                        ) : searchResults.length > 0 ? (
                            searchResults.map((anime) => {
                                const isSelected = selectedAnime.some(a => a.mal_id === anime.mal_id);
                                return (
                                    <div key={anime.mal_id} className={`add-anime-item ${isSelected ? 'selected' : ''}`}>
                                        <div className="add-anime-info-container">
                                            {anime.image_url ? (
                                                <img src={anime.image_url} alt={anime.title} className="add-anime-banner" />
                                            ) : (
                                                <div className="add-anime-banner"></div>
                                            )}
                                            <div className="add-anime-info">
                                                <span className="add-anime-title">{anime.title}</span>
                                                <span className="add-anime-episodes">{anime.num_episodes ? `${anime.num_episodes} Episodes` : 'Unknown Episodes'}</span>
                                            </div>
                                        </div>
                                        {targetShowId ? (
                                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                                <button
                                                    className={`add-anime-add-btn ${isSelected ? 'selected' : ''}`}
                                                    onClick={() => toggleSelection(anime)}
                                                >
                                                    {isSelected ? CHECK_ICON_18 : PLUS_ICON_18}
                                                </button>
                                                <button
                                                    className="add-anime-add-btn"
                                                    onClick={() => handleLinkToMAL(anime)}
                                                    disabled={isSubmitting}
                                                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                                                >
                                                    This is it!
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                className={`add-anime-add-btn ${isSelected ? 'selected' : ''}`}
                                                onClick={() => toggleSelection(anime)}
                                            >
                                                {isSelected ? CHECK_ICON_18 : PLUS_ICON_18}
                                            </button>
                                        )}
                                    </div>
                                );
                            })
                        ) : searchQuery.trim().length >= 3 ? (
                            <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No anime found.</div>
                        ) : (
                            <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Type at least 3 characters to search.</div>
                        )}
                    </div>
                </div>

                <div className="add-anime-modal-footer" style={{ alignItems: 'center' }}>
                    {statusMessage && (
                        <div style={{
                            marginRight: 'auto',
                            color: statusMessage.type === 'success' ? COLORS.BASE.GREEN : COLORS.BASE.RED,
                            display: 'flex',
                            alignItems: 'center',
                            fontWeight: 500,
                            fontSize: '0.9rem'
                        }}>
                            {statusMessage.text}
                        </div>
                    )}
                    {(!targetShowId || selectedAnime.length > 0) && (
                        <button
                            className="add-anime-submit-btn"
                            onClick={handleSubmit}
                            disabled={selectedAnime.length === 0 || isSubmitting}
                        >
                            {isSubmitting ? 'Adding...' : `Add Selected (${selectedAnime.length})`}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
