import React from 'react';
import { MediaMediaTag } from './MediaMediaTag';
import type { MediaSourceCategory } from "../../../../types/types";

interface MediaSourceCardTagsProps {
    extensions: string[];
    mediaType: MediaSourceCategory;
}

export const MediaSourceCardTags: React.FC<MediaSourceCardTagsProps> = ({ extensions, mediaType }) => {
    return (
        <div className="media-source-tags">
            {extensions.length > 0 ? (
                extensions.map(ext => (
                    <MediaMediaTag key={ext} extension={ext} mediaType={mediaType} />
                ))
            ) : (
                <MediaMediaTag extension={mediaType} mediaType={mediaType} />
            )}
        </div>
    );
};
