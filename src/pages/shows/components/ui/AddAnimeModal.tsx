import React, { useState, useEffect } from 'react';
import { Search, X, Plus, Check } from 'lucide-react';
import type { AnimeData } from '../../../../introverts/show/anime';
import { searchAnime } from '../../../../introverts/show/anime';
import { addSeasonalAnimeDB } from '../../../../ambiverts/show/anime';

interface AddAnimeModalProps {
    onClose: () => void;
}

export const AddAnimeModal: React.FC<AddAnimeModalProps> = ({ onClose }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<AnimeData[]>([]);
    const [selectedAnime, setSelectedAnime] = useState<AnimeData[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [statusMessage, setStatusMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

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
        
        const success = await addSeasonalAnimeDB(selectedAnime);
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

    return (
        <div className="add-anime-modal-overlay" onClick={onClose}>
            <div className="add-anime-modal-content" onClick={e => e.stopPropagation()}>
                <div className="add-anime-modal-header">
                    <h2>Add Anime</h2>
                    <button className="add-anime-close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>
                
                <div className="add-anime-modal-body">
                    <div className="add-anime-search-container">
                        <input 
                            type="text" 
                            placeholder="Search for anime..." 
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
                            searchResults.map((anime) => {
                                const isSelected = selectedAnime.some(a => a.mal_id === anime.mal_id);
                                return (
                                    <div key={anime.mal_id} className={`add-anime-item ${isSelected ? 'selected' : ''}`}>
                                        <div className="add-anime-info">
                                            <span className="add-anime-title">{anime.title}</span>
                                            <span className="add-anime-episodes">{anime.num_episodes ? `${anime.num_episodes} Episodes` : 'Unknown Episodes'}</span>
                                        </div>
                                        <button 
                                            className={`add-anime-add-btn ${isSelected ? 'selected' : ''}`}
                                            onClick={() => toggleSelection(anime)}
                                        >
                                            {isSelected ? <Check size={18} /> : <Plus size={18} />}
                                        </button>
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
                            color: statusMessage.type === 'success' ? '#10b981' : '#ef4444', 
                            display: 'flex', 
                            alignItems: 'center', 
                            fontWeight: 500,
                            fontSize: '0.9rem'
                        }}>
                            {statusMessage.text}
                        </div>
                    )}
                    <button 
                        className="add-anime-submit-btn" 
                        onClick={handleSubmit} 
                        disabled={selectedAnime.length === 0 || isSubmitting}
                    >
                        {isSubmitting ? 'Adding...' : `Add Selected (${selectedAnime.length})`}
                    </button>
                </div>
            </div>
        </div>
    );
};
