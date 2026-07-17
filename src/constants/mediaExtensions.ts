import { COLORS } from './color';

export const MEDIA_EXT_COLORS: Record<string, string> = {

    mkv: COLORS.BASE.ORANGE,
    mp4: COLORS.BASE.RED,
    avi: COLORS.BASE.YELLOW,
    webm: COLORS.BASE.AMBER,
    mov: COLORS.BASE.PINK,
    m4v: COLORS.BASE.ROSE,


    mp3: COLORS.BASE.FUCHSIA,
    flac: COLORS.BASE.PURPLE,
    wav: COLORS.BASE.INDIGO,
    m4a: COLORS.BASE.VIOLET,
    ogg: COLORS.BASE.PINK,
    aac: COLORS.BASE.MAGENTA,


    jpg: COLORS.BASE.BLUE,
    jpeg: COLORS.BASE.BLUE,
    png: COLORS.BASE.CYAN,
    gif: COLORS.BASE.TEAL,
    webp: COLORS.BASE.SKY,
    svg: COLORS.BASE.EMERALD,
    bmp: COLORS.BASE.LIME,
    ico: COLORS.BASE.GREEN,
};

export const getExtensionColor = (ext: string, fallback: string = '#888888') => {
    return MEDIA_EXT_COLORS[ext.toLowerCase()] || fallback;
};
