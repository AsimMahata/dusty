import { ICONS } from '../../constants/icon';

export const getFileIcon = (filename: string, is_dir: boolean) => {
    if (is_dir) return ICONS.FILE.FOLDER;

    const ext = filename.split('.').pop()?.toLowerCase();
    const lowerName = filename.toLowerCase();

    if (lowerName === 'package.json' || lowerName === 'package-lock.json' || ext === 'json') return ICONS.FILE.JSON;
    if (lowerName === '.gitignore' || lowerName === '.env' || lowerName.includes('config')) return ICONS.FILE.CONFIG;
    if (lowerName.includes('readme') || ext === 'md') return ICONS.FILE.MARKDOWN;
    if (lowerName.includes('vite')) return ICONS.FILE.VITE;

    switch (ext) {
        case 'html': return ICONS.FILE.HTML;
        case 'css': return ICONS.FILE.CSS;
        case 'js': 
        case 'jsx': return ICONS.FILE.JS;
        case 'ts': 
        case 'tsx': return ICONS.FILE.TS;
        case 'png':
        case 'jpg':
        case 'jpeg':
        case 'svg':
        case 'gif': return ICONS.FILE.IMAGE;
        case 'mp3':
        case 'wav': return ICONS.FILE.AUDIO;
        case 'mp4':
        case 'mkv': return ICONS.FILE.VIDEO;
        case 'zip':
        case 'tar':
        case 'gz': return ICONS.FILE.ARCHIVE;
        default: return ICONS.FILE.DEFAULT;
    }
};
