import { PROJECT_TAGS } from '../constants/constants';

export const generateTagGradient = (tags?: string[]): string => {
    if (!tags || tags.length === 0) {
        return 'linear-gradient(135deg, var(--bg-card-hover) 0%, var(--bg-card) 100%)';
    }

    const tagColors = tags
        .slice(0, 2)
        .map(tagId => PROJECT_TAGS.getDefinition(tagId).color);

    if (tagColors.length === 1) {
        return `linear-gradient(135deg, ${tagColors[0]}40 0%, var(--bg-card) 100%)`;
    }
    return `linear-gradient(135deg, ${tagColors[0]}40 0%, ${tagColors[1]}40 100%)`;
};
