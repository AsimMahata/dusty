
import { ICONS } from './icon';
import { COLORS } from './color';
import type { TagDefinition } from "../types/projects";
const PREDEFINED_TAGS: Record<string, TagDefinition> = {
    rust: { id: "rust", label: "Rust", icon: ICONS.PROJECT_TAGS.RUST, color: COLORS.BASE.ORANGE },
    react: { id: "react", label: "React", icon: ICONS.PROJECT_TAGS.REACT, color: COLORS.BASE.BLUE },
    tauri: { id: "tauri", label: "Tauri", icon: ICONS.PROJECT_TAGS.TAURI, color: COLORS.BASE.YELLOW },
    python: { id: "python", label: "Python", icon: ICONS.PROJECT_TAGS.PYTHON, color: COLORS.BASE.YELLOW_400 },
    ai: { id: "ai", label: "AI", icon: ICONS.PROJECT_TAGS.AI, color: COLORS.BASE.PURPLE },
    machine_learning: { id: "machine_learning", label: "Machine Learning", icon: ICONS.PROJECT_TAGS.MACHINE_LEARNING, color: COLORS.BASE.FUCHSIA },
    game: { id: "game", label: "Game", icon: ICONS.PROJECT_TAGS.GAME, color: COLORS.BASE.RED },
    desktop: { id: "desktop", label: "Desktop", icon: ICONS.PROJECT_TAGS.DESKTOP, color: COLORS.BASE.SKY },
    backend: { id: "backend", label: "Backend", icon: ICONS.PROJECT_TAGS.BACKEND, color: COLORS.BASE.TEAL },
    frontend: { id: "frontend", label: "Frontend", icon: ICONS.PROJECT_TAGS.FRONTEND, color: COLORS.BASE.PINK },
    personal: { id: "personal", label: "Personal", icon: ICONS.PROJECT_TAGS.PERSONAL, color: COLORS.BASE.GREEN_500 },
    college: { id: "college", label: "College", icon: ICONS.PROJECT_TAGS.COLLEGE, color: COLORS.BASE.CYAN },
    archived: { id: "archived", label: "Archived", icon: ICONS.PROJECT_TAGS.ARCHIVED, color: COLORS.BASE.ZINC },
};

const getTagDefinition = (tagId: string): TagDefinition => {
    const normalized = tagId.toLowerCase().replace(" ", "_");
    if (PREDEFINED_TAGS[normalized]) {
        return PREDEFINED_TAGS[normalized];
    }
    
    // Fallback for unknown tags
    return {
        id: tagId,
        label: tagId.charAt(0).toUpperCase() + tagId.slice(1),
        color: "#52525b" // text-muted
    };
};

const getAllPredefinedTags = (): TagDefinition[] => {
    return Object.values(PREDEFINED_TAGS);
};

export const PROJECT_TAGS = {
    PREDEFINED: PREDEFINED_TAGS,
    getDefinition: getTagDefinition,
    getAllPredefined: getAllPredefinedTags
};
