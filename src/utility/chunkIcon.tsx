import React from 'react';
import { ICONS } from '../constants/icon';

export const getChunkFileIcon = (ext?: string): React.ReactNode => {
    if (!ext) return ICONS.FILE.FOLDER_EMPTY;

    const lower = ext.toLowerCase();

    if (['zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz', 'iso', 'img'].includes(lower)) return ICONS.FILE.ARCHIVE_OPEN;
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'].includes(lower)) return ICONS.FILE.IMAGE;
    if (['mp3', 'wav', 'flac', 'ogg', 'm4a', 'aac'].includes(lower)) return ICONS.FILE.AUDIO;
    if (['mp4', 'mkv', 'avi', 'mov', 'wmv', 'webm'].includes(lower)) return ICONS.FILE.VIDEO;
    if (['json', 'jsonc'].includes(lower)) return ICONS.FILE.JSON;
    if (['ts', 'tsx'].includes(lower)) return ICONS.FILE.TS;
    if (['js', 'jsx'].includes(lower)) return ICONS.FILE.JS;
    if (['html', 'htm'].includes(lower)) return ICONS.FILE.HTML;
    if (['css', 'scss', 'sass'].includes(lower)) return ICONS.FILE.CSS;
    if (['md', 'txt', 'rst', 'pdf', 'doc', 'docx'].includes(lower)) return ICONS.FILE.MARKDOWN;
    if (['toml', 'ini', 'cfg', 'yaml', 'yml'].includes(lower)) return ICONS.FILE.CONFIG;

    return ICONS.FILE.DEFAULT;
};
