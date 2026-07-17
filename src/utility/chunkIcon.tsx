import React from 'react';
import { ICONS } from '../constants/icon';
import { getExtensionColor } from '../constants/mediaExtensions';

export const getChunkFileIcon = (ext?: string): React.ReactNode => {
    if (!ext) return ICONS.FILE.FOLDER_EMPTY;

    const lower = ext.toLowerCase();

    let icon = ICONS.FILE.DEFAULT;

    if (['zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz', 'iso', 'img'].includes(lower)) icon = ICONS.FILE.ARCHIVE_OPEN;
    else if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'].includes(lower)) icon = ICONS.FILE.IMAGE;
    else if (['mp3', 'wav', 'flac', 'ogg', 'm4a', 'aac'].includes(lower)) icon = ICONS.FILE.AUDIO;
    else if (['mp4', 'mkv', 'avi', 'mov', 'wmv', 'webm'].includes(lower)) icon = ICONS.FILE.VIDEO;
    else if (['json', 'jsonc'].includes(lower)) icon = ICONS.FILE.JSON;
    else if (['ts', 'tsx'].includes(lower)) icon = ICONS.FILE.TS;
    else if (['js', 'jsx'].includes(lower)) icon = ICONS.FILE.JS;
    else if (['html', 'htm'].includes(lower)) icon = ICONS.FILE.HTML;
    else if (['css', 'scss', 'sass'].includes(lower)) icon = ICONS.FILE.CSS;
    else if (['md', 'txt', 'rst', 'pdf', 'doc', 'docx'].includes(lower)) icon = ICONS.FILE.MARKDOWN;
    else if (['toml', 'ini', 'cfg', 'yaml', 'yml'].includes(lower)) icon = ICONS.FILE.CONFIG;

    const color = ext ? getExtensionColor(ext) : undefined;
    return color ? React.cloneElement(icon as React.ReactElement, { color }) : icon;
};
