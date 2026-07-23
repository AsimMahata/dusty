import React from 'react';
import { MovingTitle } from '../../../../../ui/MovingTitle';

interface MediaSourceCardHeaderProps {
    title: string;
}

export const MediaSourceCardHeader: React.FC<MediaSourceCardHeaderProps> = ({ title }) => {
    return (
        <div className="media-source-card-header">
            <MovingTitle title={title} maxLength={25} />
        </div>
    );
};
