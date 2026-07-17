import React from 'react';
import type { MediaSourceCategory } from '../../../../constants/constants';
import { getExtensionColor } from '../../../../../../constants/mediaExtensions';
import '../../../../css/MediaSources.css';

interface MediaMediaTagProps {
    extension: string;
    mediaType: MediaSourceCategory;
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
