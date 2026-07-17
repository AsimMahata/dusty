import React from 'react';
import { ICONS } from '../../constants/icon';
import { getExtensionColor } from '../../constants/mediaExtensions';

export const getFileIcon = (filename: string, is_dir: boolean) => {
    if (is_dir) return ICONS.FILE.FOLDER;

    const ext = filename.split('.').pop()?.toLowerCase();
    const lowerName = filename.toLowerCase();

    if (lowerName === 'package.json' || lowerName === 'package-lock.json' || ext === 'json') return ICONS.FILE.JSON;
    if (lowerName === '.gitignore' || lowerName === '.env' || lowerName.includes('config')) return ICONS.FILE.CONFIG;
    if (lowerName.includes('readme') || ext === 'md') return ICONS.FILE.MARKDOWN;
    if (lowerName.includes('vite')) return ICONS.FILE.VITE;

    let icon = ICONS.FILE.DEFAULT;

    switch (ext) {
        case 'html': icon = ICONS.FILE.HTML; break;
        case 'css': icon = ICONS.FILE.CSS; break;
        case 'js': 
        case 'jsx': icon = ICONS.FILE.JS; break;
        case 'ts': 
        case 'tsx': icon = ICONS.FILE.TS; break;
        case 'png':
        case 'jpg':
        case 'jpeg':
        case 'svg':
        case 'gif': icon = ICONS.FILE.IMAGE; break;
        case 'mp3':
        case 'wav': icon = ICONS.FILE.AUDIO; break;
        case 'mp4':
        case 'mkv': icon = ICONS.FILE.VIDEO; break;
        case 'zip':
        case 'tar':
        case 'gz': icon = ICONS.FILE.ARCHIVE; break;
        default: icon = ICONS.FILE.DEFAULT; break;
    }

    const color = ext ? getExtensionColor(ext) : undefined;
    return color ? React.cloneElement(icon as React.ReactElement<any>, { color }) : icon;
};
