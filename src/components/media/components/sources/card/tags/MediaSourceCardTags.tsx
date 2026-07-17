import React from 'react';
import type { MediaSourceCategory } from '../../../../constants/constants';
import { MediaMediaTag } from './MediaMediaTag';

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
