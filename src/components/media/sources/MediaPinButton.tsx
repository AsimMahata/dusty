import React from 'react';
import { Star } from 'lucide-react';
import './MediaSources.css';

interface MediaPinButtonProps {
    isPinned: boolean;
    onClick: (e: React.MouseEvent) => void;
}

export const MediaPinButton: React.FC<MediaPinButtonProps> = ({ isPinned, onClick }) => {
    return (
        <button 
            className={`media-pin-btn ${isPinned ? 'is-pinned' : ''}`}
            onClick={onClick}
            title={isPinned ? "Unpin Source" : "Pin Source"}
        >
            <Star size={16} fill={isPinned ? "currentColor" : "none"} />
        </button>
    );
};
