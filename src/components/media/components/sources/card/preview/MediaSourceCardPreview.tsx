import React from 'react';
import type { MediaSourceItem } from "../../../../../../types/media";

interface MediaSourceCardPreviewProps {
    item: MediaSourceItem;
}

export const MediaSourceCardPreview: React.FC<MediaSourceCardPreviewProps> = ({ item }) => {
    return (
        <div className="media-source-card-preview">
            {item.icon}
        </div>
    );
};
