import React from 'react';
import { ContextMenu } from '../../../../ui/ContextMenu';
import { getMediaSourceMenuActions } from '../../../actions/menuActions';
import type { MediaSourceItem } from "../../../types/types";

interface MediaSourceContextMenuProps {
    x: number;
    y: number;
    item: MediaSourceItem;
    isPinned: boolean;
    onClose: () => void;
    onOpen: (item: MediaSourceItem) => void;
    onPinToggle: (item: MediaSourceItem) => void;
}

export const MediaSourceContextMenu: React.FC<MediaSourceContextMenuProps> = ({
    x, y, item, isPinned, onClose, onOpen, onPinToggle
}) => {
    const actions = getMediaSourceMenuActions(item, isPinned, onOpen, onPinToggle, onClose);

    return (
        <ContextMenu
            x={x}
            y={y}
            actions={actions}
            onClose={onClose}
        />
    );
};
