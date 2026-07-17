import { PROJECT_TAGS } from '../constants/projectTags';

import { getExtensionColor } from '../constants/mediaExtensions';

export const generateTagGradient = (tags?: string[]): string => {
    if (!tags || tags.length === 0) {
        return 'linear-gradient(135deg, var(--bg-card-hover) 0%, var(--bg-card) 100%)';
    }

    const tagColors = tags
        .slice(0, 2)
        .map(tagId => PROJECT_TAGS.getDefinition(tagId).color);

    if (tagColors.length === 1) {
        // Linear gradient from the tag color (with transparency) to background
        return `linear-gradient(135deg, ${tagColors[0]}40 0%, var(--bg-card) 100%)`;
    }

    // Linear gradient between two tags
    return `linear-gradient(135deg, ${tagColors[0]}40 0%, ${tagColors[1]}40 100%)`;
};

export const generateExtSideBarGradient = (extensions: string[], fallback: string): string => {
    if (!extensions || extensions.length === 0) {
        return fallback;
    }

    const colors = extensions.slice(0, 2).map(ext => getExtensionColor(ext, fallback));

    if (colors.length === 1) {
        return colors[0];
    }

    return `linear-gradient(to bottom, ${colors[0]} 0%, ${colors[1]} 100%)`;
};
