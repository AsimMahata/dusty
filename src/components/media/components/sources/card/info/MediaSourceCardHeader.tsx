import React from 'react';
import { MORE_OPTIONS_ICON } from '../../../../constants/icons';

interface MediaSourceCardHeaderProps {
    title: string;
    onMenuClick: (e: React.MouseEvent) => void;
}

export const MediaSourceCardHeader: React.FC<MediaSourceCardHeaderProps> = ({ title, onMenuClick }) => {
    return (
        <div className="media-source-header">
            <h3 className="media-source-title">{title}</h3>
            <button className="media-source-menu-btn" onClick={onMenuClick}>
                {MORE_OPTIONS_ICON}
            </button>
        </div>
    );
};
