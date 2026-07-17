import React from 'react';
import type { Item, MediaType } from '../../../types/types';
import { MediaSourceCard } from './MediaSourceCard';
import './MediaSources.css';

interface MediaSourceGridProps {
    items: Item[];
    mediaType: MediaType;
    extensionsMap: Record<string, string[]>;
    pinnedMap: Record<string, boolean>;
    onOpen: (item: Item) => void;
    onPinToggle: (item: Item) => void;
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
