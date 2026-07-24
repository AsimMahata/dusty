import React from 'react';
import { getFileExtensionColor } from '../../../../../../constants/color';
import '../../../../css/MediaSources.css';
import type { MediaSourceCategory } from "../../../../types/types";

interface MediaMediaTagProps {
    extension: string;
    mediaType: MediaSourceCategory;
}

export const MediaMediaTag: React.FC<MediaMediaTagProps> = ({ extension, mediaType }) => {
    const defaultColor = mediaType === 'music' ? '#d946ef' : mediaType === 'video' ? '#f97316' : '#3b82f6';
    const color = getFileExtensionColor(extension, defaultColor);

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
