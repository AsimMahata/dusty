import React from 'react';
import type { MediaType } from '../../../types/types';
import { getExtensionColor } from '../../../constants/mediaExtensions';
import './MediaSources.css';

interface MediaMediaTagProps {
    extension: string;
    mediaType: MediaType;
}

export const MediaMediaTag: React.FC<MediaMediaTagProps> = ({ extension, mediaType }) => {
    const defaultColor = mediaType === 'music' ? '#d946ef' : mediaType === 'video' ? '#f97316' : '#3b82f6';
    const color = getExtensionColor(extension, defaultColor);
    
    return (
        <span 
            className="media-tag"
            style={{ 
                color: color, 
                backgroundColor: `${color}15`, 
                border: `1px solid ${color}30` 
            }}
        >
            {extension.toUpperCase()}
        </span>
    );
};
