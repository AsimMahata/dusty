import React, { useState } from 'react';
import type { Item, MediaType } from '../../../types/types';
import { MoreVertical } from 'lucide-react';
import { MediaMediaTag } from './MediaMediaTag';
import { MediaPinButton } from './MediaPinButton';
import { MediaSourceContextMenu } from './MediaSourceContextMenu';
import { generateExtSideBarGradient } from '../../../utility/gradient';
import { getExtensionColor } from '../../../constants/mediaExtensions';
import './MediaSources.css';

interface MediaSourceCardProps {
    item: Item;
    extensions: string[];
    mediaType: MediaType;
    isPinned: boolean;
    onOpen: (item: Item) => void;
    onPinToggle: (item: Item) => void;
}

export const MediaSourceCard: React.FC<MediaSourceCardProps> = ({
    item, extensions, mediaType, isPinned, onOpen, onPinToggle
}) => {
    const [menuPos, setMenuPos] = useState<{x: number, y: number} | null>(null);

    const handleMenuClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        const rect = e.currentTarget.getBoundingClientRect();
        setMenuPos({ x: rect.right, y: rect.bottom });
    };

    const defaultColor = mediaType === 'music' ? '#d946ef' : mediaType === 'video' ? '#f97316' : '#3b82f6';
    const hoverBorderBg = generateExtSideBarGradient(extensions, defaultColor);

    const hoverColor = extensions.length > 0 ? getExtensionColor(extensions[0], defaultColor) : defaultColor;

    return (
        <div 
            className="media-source-card" 
            onClick={() => onOpen(item)}
            style={{ '--hover-border-bg': hoverBorderBg, '--hover-color': hoverColor } as React.CSSProperties}
        >
            <div className="media-source-card-inner">
                <MediaPinButton 
                    isPinned={isPinned} 
                    onClick={(e) => { e.stopPropagation(); onPinToggle(item); }} 
                />

                <div className="media-source-card-preview">
                    {item.icon}
                </div>

                <div className="media-source-card-info">
                    <div className="media-source-card-header">
                        <h3 className="media-source-card-title" title={item.title}>
                            {item.title}
                        </h3>
                        <button 
                            className="media-source-menu-btn"
                            onClick={handleMenuClick}
                        >
                            <MoreVertical size={16} />
                        </button>
                    </div>

                    <div className="media-source-tags">
                        {extensions.length > 0 ? (
                            extensions.map(ext => (
                                <MediaMediaTag key={ext} extension={ext} mediaType={mediaType} />
                            ))
                        ) : (
                            <MediaMediaTag extension={mediaType} mediaType={mediaType} />
                        )}
                    </div>

                    <div className="media-source-meta">
                        <div>Updated N/A</div>
                        <div className="media-source-path" title={item.path}>{item.path}</div>
                    </div>
                </div>
            </div>

            {menuPos && (
                <MediaSourceContextMenu
                    x={menuPos.x}
                    y={menuPos.y}
                    item={item}
                    isPinned={isPinned}
                    onClose={() => setMenuPos(null)}
                    onOpen={onOpen}
                    onPinToggle={onPinToggle}
                />
            )}
        </div>
    );
};
