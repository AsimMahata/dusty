import React from 'react';
import { ContextMenu } from '../../ui/ContextMenu';
import type { Item } from '../../../types/types';
import { FolderOpen, ExternalLink, Copy, Star } from 'lucide-react';
import { invoke } from '@tauri-apps/api/core';
import { CMD_OPEN_FILE } from '../../../constants/commands';

interface MediaSourceContextMenuProps {
    x: number;
    y: number;
    item: Item;
    isPinned: boolean;
    onClose: () => void;
    onOpen: (item: Item) => void;
    onPinToggle: (item: Item) => void;
}

export const MediaSourceContextMenu: React.FC<MediaSourceContextMenuProps> = ({
    x, y, item, isPinned, onClose, onOpen, onPinToggle
}) => {
    return (
        <ContextMenu 
            x={x} 
            y={y} 
            actions={[
                { 
                    label: 'Open', 
                    icon: <FolderOpen size={16} />,
                    onClick: () => {
                        onOpen(item);
                        onClose();
                    } 
                },
                { 
                    label: 'Reveal in File Explorer', 
                    icon: <ExternalLink size={16} />,
                    onClick: async () => {
                        try {
                            if (item.path) {
                                await invoke(CMD_OPEN_FILE, { path: item.path });
                            }
                        } catch (e) {
                            console.error("Failed to reveal:", e);
                        }
                        onClose();
                    } 
                },
                { 
                    label: 'Copy Path', 
                    icon: <Copy size={16} />,
                    onClick: () => {
                        if (item.path) {
                            navigator.clipboard.writeText(item.path);
                        }
                        onClose();
                    } 
                },
                { 
                    label: isPinned ? 'Unpin' : 'Pin', 
                    icon: <Star size={16} />,
                    onClick: () => {
                        onPinToggle(item);
                        onClose();
                    },
                    separator: true
                }
            ]} 
            onClose={onClose} 
        />
    );
};
