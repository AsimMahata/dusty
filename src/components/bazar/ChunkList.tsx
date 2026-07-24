import React from 'react';
import { ChunkItem } from './ChunkItem';
import type { Chunk, BazarAction } from './types/types';

interface ChunkListProps {
    chunks: Chunk[];
    getChunkActions: (chunk: Chunk) => BazarAction[];
    onItemClick?: (chunk: Chunk) => void;
    onDoubleClick?: (chunk: Chunk) => void;
    emptyIcon?: React.ReactNode;
    emptyTitle?: string;
    emptyDesc?: string;
}

export const ChunkList: React.FC<ChunkListProps> = ({
    chunks,
    getChunkActions,
    onItemClick,
    onDoubleClick,
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
                <div
                    key={chunk.id}
                    onClick={() => onItemClick?.(chunk)}
                >
                    <ChunkItem
                        chunk={chunk}
                        actions={getChunkActions(chunk)}
                        onDoubleClick={() => onDoubleClick?.(chunk)}
                    />
                </div>
            ))}
        </div>
    );
};
