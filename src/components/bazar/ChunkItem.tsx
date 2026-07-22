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
    tags?: string[];
    onDoubleClick?: () => void;
}

const arePropsEqual = (prev: ChunkItemProps, next: ChunkItemProps) => {
    if (prev.name !== next.name ||
        prev.path !== next.path ||
        prev.extLabel !== next.extLabel ||
        prev.sizeLabel !== next.sizeLabel ||
        prev.isPinned !== next.isPinned) {
        return false;
    }

    if (prev.chunk && next.chunk) {
        if (prev.chunk.id !== next.chunk.id ||
            prev.chunk.name !== next.chunk.name ||
            prev.chunk.path !== next.chunk.path ||
            prev.chunk.ext !== next.chunk.ext ||
            prev.chunk.size !== next.chunk.size ||
            prev.chunk.is_pinned !== next.chunk.is_pinned) {
            return false;
        }
    } else if (prev.chunk !== next.chunk) {
        return false;
    }

    const prevActions = prev.actions || [];
    const nextActions = next.actions || [];
    if (prevActions.length !== nextActions.length) {
        return false;
    }
    for (let i = 0; i < prevActions.length; i++) {
        if (prevActions[i].label !== nextActions[i].label ||
            prevActions[i].color !== nextActions[i].color ||
            prevActions[i].separator !== nextActions[i].separator) {
            return false;
        }
    }

    const prevTags = prev.tags || [];
    const nextTags = next.tags || [];
    if (prevTags.length !== nextTags.length) {
        return false;
    }
    for (let i = 0; i < prevTags.length; i++) {
        if (prevTags[i] !== nextTags[i]) {
            return false;
        }
    }

    return true;
};

export const ChunkItem: React.FC<ChunkItemProps> = React.memo(({ 
    chunk, actions, name, icon, extLabel, sizeLabel, path, isPinned, tags, onDoubleClick 
}) => {
    const finalName = name ?? chunk?.name ?? '';
    const finalIcon = icon !== undefined ? icon : (chunk?.icon ?? getChunkFileIcon(chunk?.ext));
    const finalSizeLabel = sizeLabel !== undefined ? sizeLabel : (chunk?.size != null ? formatBytes(chunk.size) : null);
    const finalExtLabel = extLabel !== undefined ? extLabel : (chunk?.ext ? chunk.ext.toUpperCase() : null);
    const badgeExt = extLabel !== undefined ? extLabel?.toLowerCase() : chunk?.ext?.toLowerCase();
    const badgeColor = badgeExt ? getExtensionColor(badgeExt, 'transparent') : undefined;
    const finalPath = path !== undefined ? path : chunk?.path;
    const finalPinned = isPinned !== undefined ? isPinned : chunk?.is_pinned;
    const finalTags = tags ?? chunk?.tags;

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
                    {finalTags && finalTags.length > 0 ? (
                        finalTags.map(tag => {
                            const color = getExtensionColor(tag.toLowerCase(), 'transparent');
                            return (
                                <span 
                                    key={tag}
                                    className="chunk-badge" 
                                    data-ext={tag.toLowerCase()}
                                    style={color && color !== 'transparent' ? {
                                        color: color,
                                        backgroundColor: `${color}15`,
                                        borderColor: `${color}30`
                                    } : undefined}
                                >
                                    {tag}
                                </span>
                            );
                        })
                    ) : finalExtLabel && (
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
}, arePropsEqual);
