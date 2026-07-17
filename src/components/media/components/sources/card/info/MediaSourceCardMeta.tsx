import React from 'react';

interface MediaSourceCardMetaProps {
    path?: string;
}

export const MediaSourceCardMeta: React.FC<MediaSourceCardMetaProps> = ({ path }) => {
    return (
        <div className="media-source-meta">
            <div>Updated N/A</div>
            <div className="media-source-path" title={path}>{path}</div>
        </div>
    );
};
