import React from 'react';
import { ChunkItem } from './ChunkItem';
import type { Chunk, BazarAction } from '../../types/bazar';

interface ChunkListProps {
    chunks: Chunk[];
    getChunkActions: (chunk: Chunk) => BazarAction[];
    emptyIcon?: React.ReactNode;
    emptyTitle?: string;
    emptyDesc?: string;
}

export const ChunkList: React.FC<ChunkListProps> = ({
    chunks,
    getChunkActions,
    emptyIcon,
    emptyTitle = 'Nothing here',
    emptyDesc = 'No files were found.',
}) => {
    if (chunks.length === 0) {
        return (
            <div className="chunk-empty-state">
                {emptyIcon && <div className="chunk-empty-icon">{emptyIcon}</div>}
                <p className="chunk-empty-title">{emptyTitle}</p>
                <p className="chunk-empty-desc">{emptyDesc}</p>
            </div>
        );
    }

    return (
        <div className="chunk-list">
            {chunks.map(chunk => (
                <ChunkItem
                    key={chunk.id}
                    chunk={chunk}
                    actions={getChunkActions(chunk)}
                />
            ))}
        </div>
    );
};
