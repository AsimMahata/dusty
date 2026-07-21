import { OPEN_FOLDER_ICON, REVEAL_ICON, COPY_ICON, PIN_ICON } from '../constants/icons';
import { LABELS } from '../constants/labels';
import { invoke } from '@tauri-apps/api/core';
import { CMD_OPEN_FILE } from '../../../constants/commands';
import type { MediaSourceItem } from "../../../types/media";

export const getMediaSourceMenuActions = (
    item: MediaSourceItem,
    isPinned: boolean,
    onOpen: (item: MediaSourceItem) => void,
    onPinToggle: (item: MediaSourceItem) => void,
    onClose: () => void
) => {
    return [
        {
            label: LABELS.MENU_OPEN,
            icon: OPEN_FOLDER_ICON,
            onClick: () => {
                onOpen(item);
                onClose();
            }
        },
        {
            label: LABELS.MENU_REVEAL,
            icon: REVEAL_ICON,
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
            label: LABELS.MENU_COPY_PATH,
            icon: COPY_ICON,
            onClick: () => {
                if (item.path) {
                    navigator.clipboard.writeText(item.path);
                }
                onClose();
            }
        },
        {
            label: isPinned ? LABELS.MENU_UNPIN : LABELS.MENU_PIN,
            icon: PIN_ICON,
            onClick: () => {
                onPinToggle(item);
                onClose();
            },
            separator: true
        }
    ];
};
