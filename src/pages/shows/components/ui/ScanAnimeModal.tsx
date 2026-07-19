import React, { useState, useEffect } from 'react';
import { X, Plus, Check } from 'lucide-react';
import type { AnimeData } from '../../../../introverts/show/anime';
import { scanShowsForAnime, type ScannedAnimeData } from '../../../../introverts/show/anime';
import { addSeasonalAnimeDB } from '../../../../ambiverts/show/anime';
import type { ShowResult } from '../../../../types/types';

interface ScanAnimeModalProps {
    onClose: () => void;
    shows: ShowResult[];
}

export const ScanAnimeModal: React.FC<ScanAnimeModalProps> = ({ onClose, shows }) => {
    const [scannedResults, setScannedResults] = useState<ScannedAnimeData[]>([]);
    const [selectedAnime, setSelectedAnime] = useState<ScannedAnimeData[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isScanning, setIsScanning] = useState(true);
    const [scanProgress, setScanProgress] = useState({ current: 0, total: shows.length });
    const [statusMessage, setStatusMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

    useEffect(() => {
        let isMounted = true;

        const scanAll = async () => {
            await scanShowsForAnime(
                shows,
                (current, total) => setScanProgress({ current, total }),
                (results) => setScannedResults(results),
                () => isMounted
            );
            
            if (isMounted) setIsScanning(false);
        };
        
        scanAll();
        
        return () => { isMounted = false; };
    }, [shows]);

    const toggleSelection = (anime: ScannedAnimeData) => {
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
            <div className="add-anime-modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '800px' }}>
                <div className="add-anime-modal-header">
                    <h2>Scan For Anime</h2>
                    <button className="add-anime-close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>
                
                <div className="add-anime-modal-body">
                    {isScanning && (
                        <div style={{ marginBottom: '1rem', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between' }}>
                            <span>Scanning your shows...</span>
                            <span>{scanProgress.current} / {scanProgress.total}</span>
                        </div>
                    )}
                    
                    <div className="add-anime-list" style={{ maxHeight: '60vh' }}>
                        {scannedResults.length > 0 ? (
                            scannedResults.map((anime) => {
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
                                                <span className="add-anime-episodes" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                                    <span style={{ 
                                                        background: 'var(--primary-dark)', 
                                                        color: 'white', 
                                                        padding: '0.1rem 0.4rem', 
                                                        borderRadius: '4px',
                                                        fontSize: '0.75rem'
                                                    }}>
                                                        Priority {anime.priority}
                                                    </span>
                                                    <span>(from: {anime.sourceQuery})</span>
                                                </span>
                                            </div>
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
                        ) : isScanning ? (
                            <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                Waiting for results...
                            </div>
                        ) : (
                            <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                No anime found from your shows.
                            </div>
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
