
import { ICONS } from './icon';
import { COLORS } from './color';
import type { TagDefinition } from "../types/projects";
const PREDEFINED_TAGS: Record<string, TagDefinition> = {
    rust: { id: "rust", label: "Rust", icon: ICONS.PROJECT_TAGS.RUST, color: COLORS.BASE.ORANGE },
    typescript: { id: "typescript", label: "TypeScript", icon: ICONS.PROJECT_TAGS.REACT, color: COLORS.BASE.BLUE },
    javascript: { id: "javascript", label: "JavaScript", icon: ICONS.PROJECT_TAGS.REACT, color: COLORS.BASE.YELLOW },
    react: { id: "react", label: "React", icon: ICONS.PROJECT_TAGS.REACT, color: COLORS.BASE.BLUE },
    nextjs: { id: "nextjs", label: "Next.js", icon: ICONS.PROJECT_TAGS.REACT, color: COLORS.BASE.ZINC },
    vue: { id: "vue", label: "Vue", icon: ICONS.PROJECT_TAGS.FRONTEND, color: COLORS.BASE.GREEN },
    angular: { id: "angular", label: "Angular", icon: ICONS.PROJECT_TAGS.FRONTEND, color: COLORS.BASE.RED },
    svelte: { id: "svelte", label: "Svelte", icon: ICONS.PROJECT_TAGS.FRONTEND, color: COLORS.BASE.ORANGE },
    astro: { id: "astro", label: "Astro", icon: ICONS.PROJECT_TAGS.FRONTEND, color: COLORS.BASE.PURPLE },
    solidjs: { id: "solidjs", label: "SolidJS", icon: ICONS.PROJECT_TAGS.FRONTEND, color: COLORS.BASE.SKY },
    tauri: { id: "tauri", label: "Tauri", icon: ICONS.PROJECT_TAGS.TAURI, color: COLORS.BASE.YELLOW },
    electron: { id: "electron", label: "Electron", icon: ICONS.PROJECT_TAGS.DESKTOP, color: COLORS.BASE.BLUE },
    python: { id: "python", label: "Python", icon: ICONS.PROJECT_TAGS.PYTHON, color: COLORS.BASE.YELLOW_400 },
    django: { id: "django", label: "Django", icon: ICONS.PROJECT_TAGS.BACKEND, color: COLORS.BASE.GREEN },
    flask: { id: "flask", label: "Flask", icon: ICONS.PROJECT_TAGS.BACKEND, color: COLORS.BASE.ZINC },
    fastapi: { id: "fastapi", label: "FastAPI", icon: ICONS.PROJECT_TAGS.BACKEND, color: COLORS.BASE.TEAL },
    java: { id: "java", label: "Java", icon: ICONS.PROJECT_TAGS.BACKEND, color: COLORS.BASE.RED },
    spring_boot: { id: "spring_boot", label: "Spring Boot", icon: ICONS.PROJECT_TAGS.BACKEND, color: COLORS.BASE.GREEN_500 },
    nodejs: { id: "nodejs", label: "Node.js", icon: ICONS.PROJECT_TAGS.BACKEND, color: COLORS.BASE.GREEN },
    express: { id: "express", label: "Express", icon: ICONS.PROJECT_TAGS.BACKEND, color: COLORS.BASE.ZINC },
    nestjs: { id: "nestjs", label: "NestJS", icon: ICONS.PROJECT_TAGS.BACKEND, color: COLORS.BASE.ROSE },
    c_cpp: { id: "c_cpp", label: "C/C++", icon: ICONS.PROJECT_TAGS.RUST, color: COLORS.BASE.BLUE },
    csharp: { id: "csharp", label: "C#", icon: ICONS.PROJECT_TAGS.RUST, color: COLORS.BASE.PURPLE },
    dotnet: { id: "dotnet", label: ".NET", icon: ICONS.PROJECT_TAGS.BACKEND, color: COLORS.BASE.VIOLET },
    go: { id: "go", label: "Go", icon: ICONS.PROJECT_TAGS.BACKEND, color: COLORS.BASE.CYAN },
    php: { id: "php", label: "PHP", icon: ICONS.PROJECT_TAGS.BACKEND, color: COLORS.BASE.INDIGO },
    laravel: { id: "laravel", label: "Laravel", icon: ICONS.PROJECT_TAGS.BACKEND, color: COLORS.BASE.RED },
    ruby: { id: "ruby", label: "Ruby", icon: ICONS.PROJECT_TAGS.BACKEND, color: COLORS.BASE.ROSE },
    rails: { id: "rails", label: "Rails", icon: ICONS.PROJECT_TAGS.BACKEND, color: COLORS.BASE.RED },
    dart: { id: "dart", label: "Dart", icon: ICONS.PROJECT_TAGS.MACHINE_LEARNING, color: COLORS.BASE.SKY },
    flutter: { id: "flutter", label: "Flutter", icon: ICONS.PROJECT_TAGS.MACHINE_LEARNING, color: COLORS.BASE.CYAN },
    ai: { id: "ai", label: "AI", icon: ICONS.PROJECT_TAGS.AI, color: COLORS.BASE.PURPLE },
    machine_learning: { id: "machine_learning", label: "Machine Learning", icon: ICONS.PROJECT_TAGS.MACHINE_LEARNING, color: COLORS.BASE.FUCHSIA },
    game: { id: "game", label: "Game", icon: ICONS.PROJECT_TAGS.GAME, color: COLORS.BASE.RED },
    desktop: { id: "desktop", label: "Desktop", icon: ICONS.PROJECT_TAGS.DESKTOP, color: COLORS.BASE.SKY },
    backend: { id: "backend", label: "Backend", icon: ICONS.PROJECT_TAGS.BACKEND, color: COLORS.BASE.TEAL },
    frontend: { id: "frontend", label: "Frontend", icon: ICONS.PROJECT_TAGS.FRONTEND, color: COLORS.BASE.PINK },
    web: { id: "web", label: "Web", icon: ICONS.PROJECT_TAGS.FRONTEND, color: COLORS.BASE.SKY },
    mobile: { id: "mobile", label: "Mobile", icon: ICONS.PROJECT_TAGS.DESKTOP, color: COLORS.BASE.VIOLET },
    cli: { id: "cli", label: "CLI", icon: ICONS.PROJECT_TAGS.RUST, color: COLORS.BASE.ZINC },
    api: { id: "api", label: "API", icon: ICONS.PROJECT_TAGS.BACKEND, color: COLORS.BASE.TEAL },
    database: { id: "database", label: "Database", icon: ICONS.PROJECT_TAGS.BACKEND, color: COLORS.BASE.INDIGO },
    automation: { id: "automation", label: "Automation", icon: ICONS.PROJECT_TAGS.TAURI, color: COLORS.BASE.AMBER },
    open_source: { id: "open_source", label: "Open Source", icon: ICONS.PROJECT_TAGS.PERSONAL, color: COLORS.BASE.EMERALD },
    personal: { id: "personal", label: "Personal", icon: ICONS.PROJECT_TAGS.PERSONAL, color: COLORS.BASE.GREEN_500 },
    college: { id: "college", label: "College", icon: ICONS.PROJECT_TAGS.COLLEGE, color: COLORS.BASE.CYAN },
    archived: { id: "archived", label: "Archived", icon: ICONS.PROJECT_TAGS.ARCHIVED, color: COLORS.BASE.ZINC },
    vite: { id: "vite", label: "Vite", icon: ICONS.PROJECT_TAGS.VITE, color: COLORS.ICON.VITE },
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
