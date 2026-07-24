import React, { useState } from 'react';
import { MediaPinButton } from './buttons/MediaPinButton';
import { MediaSourceContextMenu } from '../menu/MediaSourceContextMenu';
import { MediaSourceCardPreview } from './preview/MediaSourceCardPreview';
import { MediaSourceCardInfo } from './info/MediaSourceCardInfo';
import { MediaSourceCardHeader } from './info/MediaSourceCardHeader';
import { MediaSourceCardTags } from './tags/MediaSourceCardTags';
import { MediaSourceCardMeta } from './info/MediaSourceCardMeta';
import { generateExtSideBarGradient } from '../../../../../utility/gradient';
import { getFileExtensionColor, COLORS } from '../../../../../constants/color';
import { MORE_OPTIONS_ICON } from '../../../constants/icons';
import '../../../css/MediaSources.css';
import type { MediaSourceCategory, MediaSourceItem } from '../../../types/types';

interface MediaSourceCardProps {
    item: MediaSourceItem;
    extensions: string[];
    mediaType: MediaSourceCategory;
    isPinned: boolean;
    onOpen: (item: MediaSourceItem) => void;
    onPinToggle: (item: MediaSourceItem) => void;
}

export const MediaSourceCard: React.FC<MediaSourceCardProps> = ({
    item, extensions, mediaType, isPinned, onOpen, onPinToggle
}) => {
    const [menuPos, setMenuPos] = useState<{ x: number, y: number } | null>(null);

    const handleMenuClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        const rect = e.currentTarget.getBoundingClientRect();
        setMenuPos({ x: rect.right, y: rect.bottom });
    };

    const defaultColor = mediaType === 'music' ? COLORS.MEDIA.MUSIC : mediaType === 'video' ? COLORS.MEDIA.VIDEO : COLORS.MEDIA.IMAGE;
    const hoverBorderBg = generateExtSideBarGradient(extensions, defaultColor);

    const hoverColor = extensions.length > 0 ? getFileExtensionColor(extensions[0], defaultColor) : defaultColor;

    return (
        <div
            className="media-source-card"
            onClick={() => onOpen(item)}
            style={{ '--hover-border-bg': hoverBorderBg, '--hover-color': hoverColor } as React.CSSProperties}
        >
            <button
                className="media-source-menu-btn"
                onClick={handleMenuClick}
            >
                {MORE_OPTIONS_ICON}
            </button>

            <div className="media-source-card-inner">
                <MediaPinButton
                    isPinned={isPinned}
                    onClick={(e) => { e.stopPropagation(); onPinToggle(item); }}
                />

                <MediaSourceCardPreview item={item} />

                <MediaSourceCardInfo>
                    <MediaSourceCardHeader
                        title={item.title}
                    />
                    <MediaSourceCardTags
                        extensions={extensions}
                        mediaType={mediaType}
                    />
                    <MediaSourceCardMeta path={item.path} />
                </MediaSourceCardInfo>
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
