import React from 'react';
import type { MediaSourceItem, MediaSourceCategory } from '../../../constants/constants';
import { MediaSourceCard } from '../card/MediaSourceCard';
import '../../../css/MediaSources.css';

interface MediaSourceGridProps {
    items: MediaSourceItem[];
    mediaType: MediaSourceCategory;
    extensionsMap: Record<string, string[]>;
    pinnedMap: Record<string, boolean>;
    onOpen: (item: MediaSourceItem) => void;
    onPinToggle: (item: MediaSourceItem) => void;
}

export const MediaSourceGrid: React.FC<MediaSourceGridProps> = ({
    items, mediaType, extensionsMap, pinnedMap, onOpen, onPinToggle
}) => {
    return (
        <div className="media-source-grid">
            {items.map(item => (
                <MediaSourceCard 
                    key={item.id}
                    item={item}
                    extensions={extensionsMap[item.path || ''] || []}
                    mediaType={mediaType}
                    isPinned={!!pinnedMap[item.id]}
                    onOpen={onOpen}
                    onPinToggle={onPinToggle}
                />
            ))}
        </div>
    );
};
