import React, { useState, useEffect, useRef } from 'react';
import { X_ICON_20, SEARCH_ICON_18, CHECK_ICON_18, PLUS_ICON_18 } from '../../../../constants/icon';
import { searchProvider } from '../../../../personalities/introverts/show/search';
import { addShowsToDb } from '../../../../personalities/introverts/show/shows';
import type { ProviderSearchResult, ShowType, ShowResult } from '../../types/types';
import { COLORS } from '../../../../constants/color';

interface AddAnimeModalProps {
    onClose: () => void;
    initialQuery?: string;
    targetShowId?: string;
    onLinkAction?: (showId: string, externalId: string, showType?: ShowType) => Promise<boolean>;
}

export const AddAnimeModal: React.FC<AddAnimeModalProps> = ({ onClose, initialQuery = '', targetShowId, onLinkAction }) => {
    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [searchResults, setSearchResults] = useState<ProviderSearchResult[]>([]);
    const [selectedAnime, setSelectedAnime] = useState<ProviderSearchResult[]>([]);
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
                const results = await searchProvider(query, 'mal');
                setSearchResults(results);
                setIsSearching(false);
            } else {
                setSearchResults([]);
            }
        }, 500);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    const toggleSelection = (anime: ProviderSearchResult) => {
        setSelectedAnime(prev =>
            prev.some(a => a.provider_id === anime.provider_id)
                ? prev.filter(a => a.provider_id !== anime.provider_id)
                : [...prev, anime]
        );
        setStatusMessage(null);
    };

    const handleSubmit = async () => {
        if (selectedAnime.length === 0) return;
        setIsSubmitting(true);
        setStatusMessage(null);

        const showsToSave: ShowResult[] = selectedAnime.map(anime => ({
            id: '',
            title: anime.title,
            get_title: anime.title,
            num_episodes: anime.num_episodes || 0,
            episodes: [],
            dir: '',
            banned: false,
            pinned: false,
            status: 'default',
            provider: 'mal',
            provider_id: anime.provider_id,
            airing: anime.airing || false,
            show_type: 'anime',
            raw_payload: anime.raw_payload
        }));

        const success = await addShowsToDb(showsToSave);
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

    const handleLinkToMAL = async (anime: ProviderSearchResult) => {
        if (!targetShowId || !onLinkAction) return;
        setIsSubmitting(true);
        setStatusMessage(null);

        try {
            const success = await onLinkAction(targetShowId, anime.provider_id, 'anime');
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
                                const isSelected = selectedAnime.some(a => a.provider_id === anime.provider_id);
                                return (
                                    <div key={anime.provider_id} className={`add-anime-item ${isSelected ? 'selected' : ''}`}>
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
