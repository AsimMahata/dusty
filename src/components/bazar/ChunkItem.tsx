import React from 'react';
import { ActionMenu } from '../ui/ActionMenu';
import type { Chunk } from '../../types/bazar';
import { getChunkFileIcon } from '../../utility/chunkIcon';
import { formatBytes } from '../../utility/util';
import { getExtensionColor } from '../../constants/mediaExtensions';
import type { ActionItem } from "../../types/core";

interface ChunkItemProps {
    chunk?: Chunk;
    actions: ActionItem[];
    
    name?: string;
    icon?: React.ReactNode;
    extLabel?: string | null;
    sizeLabel?: string | null;
    path?: string;
    isPinned?: boolean;
    onDoubleClick?: () => void;
}

export const ChunkItem: React.FC<ChunkItemProps> = ({ 
    chunk, actions, name, icon, extLabel, sizeLabel, path, isPinned, onDoubleClick 
}) => {
    const finalName = name ?? chunk?.name ?? '';
    const finalIcon = icon !== undefined ? icon : getChunkFileIcon(chunk?.ext);
    const finalSizeLabel = sizeLabel !== undefined ? sizeLabel : (chunk?.size != null ? formatBytes(chunk.size) : null);
    const finalExtLabel = extLabel !== undefined ? extLabel : (chunk?.ext ? chunk.ext.toUpperCase() : null);
    const badgeExt = extLabel !== undefined ? extLabel?.toLowerCase() : chunk?.ext?.toLowerCase();
    const badgeColor = badgeExt ? getExtensionColor(badgeExt, 'transparent') : undefined;
    const finalPath = path !== undefined ? path : chunk?.path;
    const finalPinned = isPinned !== undefined ? isPinned : chunk?.is_pinned;

    return (
        <div 
            className="chunk-item" 
            data-pinned={finalPinned ? 'true' : undefined}
            onDoubleClick={onDoubleClick}
        >
            <div className="chunk-icon-wrap">
                {finalIcon}
            </div>

            <div className="chunk-body">
                <div className="chunk-name-row">
                    <span className="chunk-name">{finalName}</span>
                    {finalPinned && <span className="chunk-pin-dot" title="Pinned" />}
                </div>
                <div className="chunk-meta">
                    {finalExtLabel && (
                        <span 
                            className="chunk-badge" 
                            data-ext={badgeExt}
                            style={badgeColor && badgeColor !== 'transparent' ? {
                                color: badgeColor,
                                backgroundColor: `${badgeColor}15`,
                                borderColor: `${badgeColor}30`
                            } : undefined}
                        >
                            {finalExtLabel}
                        </span>
                    )}
                    {finalSizeLabel && <span className="chunk-meta-sep">·</span>}
                    {finalSizeLabel && <span className="chunk-size">{finalSizeLabel}</span>}
                </div>
                {finalPath && <span className="chunk-path" title={finalPath}>{finalPath}</span>}
            </div>

            <div className="chunk-actions">
                <ActionMenu actions={actions} />
            </div>
        </div>
    );
};
