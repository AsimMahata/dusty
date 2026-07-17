import React from 'react';

interface MediaSourceCardInfoProps {
    children: React.ReactNode;
}

export const MediaSourceCardInfo: React.FC<MediaSourceCardInfoProps> = ({ children }) => {
    return (
        <div className="media-source-card-info">
            {children}
        </div>
    );
};
