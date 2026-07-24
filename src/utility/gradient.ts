import { getFileExtensionColor } from "../constants/color";

export const generateExtSideBarGradient = (extensions: string[], fallback: string): string => {
    if (!extensions || extensions.length === 0) {
        return fallback;
    }

    const colors = extensions.slice(0, 2).map(ext => getFileExtensionColor(ext, fallback));

    if (colors.length === 1) {
        return colors[0];
    }

    return `linear-gradient(to bottom, ${colors[0]} 0%, ${colors[1]} 100%)`;
};
