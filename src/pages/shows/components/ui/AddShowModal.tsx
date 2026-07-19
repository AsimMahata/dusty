import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Plus, Check } from 'lucide-react';
import type { ShowData } from '../../../../introverts/show/imdb';
import { searchShow } from '../../../../introverts/show/imdb';
import { addSeasonalShowDB } from '../../../../ambiverts/show/imdb';

interface AddShowModalProps {
    onClose: () => void;
    initialQuery?: string;
    targetShowId?: string;
    onLinkAction?: (showId: string, imdbId: string) => Promise<boolean>;
}

export const AddShowModal: React.FC<AddShowModalProps> = ({ onClose, initialQuery = '', targetShowId, onLinkAction }) => {
    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [searchResults, setSearchResults] = useState<ShowData[]>([]);
    const [selectedShow, setSelectedShow] = useState<ShowData[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [statusMessage, setStatusMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
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
                const results = await searchShow(query);
                setSearchResults(results);
                setIsSearching(false);
            } else {
                setSearchResults([]);
            }
        }, 500);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    const toggleSelection = (show: ShowData) => {
        setSelectedShow(prev => 
            prev.some(a => a.imdb_id === show.imdb_id) 
            ? prev.filter(a => a.imdb_id !== show.imdb_id)
            : [...prev, show]
        );
        setStatusMessage(null);
    };

    const handleSubmit = async () => {
        if (selectedShow.length === 0) return;
        setIsSubmitting(true);
        setStatusMessage(null);
        
        const success = await addSeasonalShowDB(selectedShow);
        setIsSubmitting(false);
        
        if (success) {
            setStatusMessage({ type: 'success', text: 'Successfully added show!' });
            setSelectedShow([]);
            setTimeout(() => {
                onClose();
            }, 1500);
        } else {
            setStatusMessage({ type: 'error', text: 'Unsuccessful in adding show.' });
        }
    };

    const handleLinkToIMDB = async (show: ShowData) => {
        if (!targetShowId || !onLinkAction) return;
        setIsSubmitting(true);
        setStatusMessage(null);

        // Add to DB first so it is cached
        await addSeasonalShowDB([show]);
        
        try {
            const success = await onLinkAction(targetShowId, show.imdb_id);
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
                    <h2>{targetShowId ? 'Link Show to IMDB' : 'Add Show'}</h2>
                    <button className="add-anime-close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>
                
                <div className="add-anime-modal-body">
                    <div className="add-anime-search-container">
                        <input 
                            ref={inputRef}
                            type="text" 
                            placeholder="Search for show..." 
                            className="add-anime-search-input" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button className="add-anime-search-btn">
                            <Search size={18} />
                        </button>
                    </div>
                    
                    <div className="add-anime-list">
                        {isSearching ? (
                            <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Searching...</div>
                        ) : searchResults.length > 0 ? (
                            searchResults.map((show) => {
                                const isSelected = selectedShow.some(a => a.imdb_id === show.imdb_id);
                                return (
                                    <div key={show.imdb_id} className={`add-anime-item ${isSelected ? 'selected' : ''}`}>
                                        <div className="add-anime-info-container">
                                            {show.image_url ? (
                                                <img src={show.image_url} alt={show.title} className="add-anime-banner" />
                                            ) : (
                                                <div className="add-anime-banner"></div>
                                            )}
                                            <div className="add-anime-info">
                                                <span className="add-anime-title">{show.title}</span>
                                                <span className="add-anime-episodes">{show.year ? `Year: ${show.year}` : 'Unknown Year'}</span>
                                            </div>
                                        </div>
                                        {targetShowId ? (
                                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                                <button 
                                                    className={`add-anime-add-btn ${isSelected ? 'selected' : ''}`}
                                                    onClick={() => toggleSelection(show)}
                                                >
                                                    {isSelected ? <Check size={18} /> : <Plus size={18} />}
                                                </button>
                                                <button 
                                                    className="add-anime-add-btn"
                                                    onClick={() => handleLinkToIMDB(show)}
                                                    disabled={isSubmitting}
                                                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                                                >
                                                    This is it!
                                                </button>
                                            </div>
                                        ) : (
                                            <button 
                                                className={`add-anime-add-btn ${isSelected ? 'selected' : ''}`}
                                                onClick={() => toggleSelection(show)}
                                            >
                                                {isSelected ? <Check size={18} /> : <Plus size={18} />}
                                            </button>
                                        )}
                                    </div>
                                );
                            })
                        ) : searchQuery.trim().length >= 3 ? (
                            <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No show found.</div>
                        ) : (
                            <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Type at least 3 characters to search.</div>
                        )}
                    </div>
                </div>

                <div className="add-anime-modal-footer" style={{ alignItems: 'center' }}>
                    {statusMessage && (
                        <div style={{
                            marginRight: 'auto', 
                            color: statusMessage.type === 'success' ? '#10b981' : '#ef4444', 
                            display: 'flex', 
                            alignItems: 'center', 
                            fontWeight: 500,
                            fontSize: '0.9rem'
                        }}>
                            {statusMessage.text}
                        </div>
                    )}
                    {(!targetShowId || selectedShow.length > 0) && (
                        <button 
                            className="add-anime-submit-btn" 
                            onClick={handleSubmit} 
                            disabled={selectedShow.length === 0 || isSubmitting}
                        >
                            {isSubmitting ? 'Adding...' : `Add Selected (${selectedShow.length})`}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
