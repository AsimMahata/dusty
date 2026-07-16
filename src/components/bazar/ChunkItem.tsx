import React from 'react';
import { ActionMenu } from '../ui/ActionMenu';
import type { Chunk, BazarAction } from '../../types/bazar';
import { getChunkFileIcon } from '../../utility/chunkIcon';
import { formatBytes } from '../../utility/util';

interface ChunkItemProps {
    chunk: Chunk;
    actions: BazarAction[];
}

export const ChunkItem: React.FC<ChunkItemProps> = ({ chunk, actions }) => {
    const icon = getChunkFileIcon(chunk.ext);
    const sizeLabel = chunk.size != null ? formatBytes(chunk.size) : null;
    const extLabel = chunk.ext ? chunk.ext.toUpperCase() : null;

    return (
        <div className="chunk-item" data-pinned={chunk.is_pinned ? 'true' : undefined}>

            <div className="chunk-icon-wrap">
                {icon}
            </div>

            <div className="chunk-body">
                <div className="chunk-name-row">
                    <span className="chunk-name">{chunk.name}</span>
                    {chunk.is_pinned && <span className="chunk-pin-dot" title="Pinned" />}
                </div>
                <div className="chunk-meta">
                    {extLabel && <span className="chunk-badge" data-ext={chunk.ext?.toLowerCase()}>{extLabel}</span>}
                    {sizeLabel && <span className="chunk-meta-sep">·</span>}
                    {sizeLabel && <span className="chunk-size">{sizeLabel}</span>}
                </div>
                {chunk.path && <span className="chunk-path" title={chunk.path}>{chunk.path}</span>}
            </div>

            <div className="chunk-actions">
                <ActionMenu actions={actions} />
            </div>
        </div>
    );
};
