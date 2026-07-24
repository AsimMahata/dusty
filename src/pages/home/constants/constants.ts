import { Tv, Folder, Music, Film, FlaskConical, Settings, ListTodo } from 'lucide-react';
import { ROUTES } from '../../../constants/routes';
import { COLORS } from '../../../constants/color';

export const HOME_STATS_CONFIG = [
    {
        label: 'Shows',
        key: 'shows' as const,
        icon: Tv,
        color: COLORS.HOME.SHOWS,
        bgColor: COLORS.HOME.SHOWS_BG,
        route: ROUTES.SHOWS,
    },
    {
        label: 'Projects',
        key: 'projects' as const,
        icon: Folder,
        color: COLORS.HOME.PROJECTS,
        bgColor: COLORS.HOME.PROJECTS_BG,
        route: ROUTES.PROJECTS,
    },
    {
        label: 'Songs',
        key: 'songs' as const,
        icon: Music,
        color: COLORS.HOME.SONGS,
        bgColor: COLORS.HOME.SONGS_BG,
        route: ROUTES.MUSIC,
    },
    {
        label: 'Videos',
        key: 'videos' as const,
        icon: Film,
        color: COLORS.HOME.VIDEOS,
        bgColor: COLORS.HOME.VIDEOS_BG,
        route: ROUTES.VIDEOS,
    }
];

export const HOME_HEADER_ACTIONS = [
    { label: 'Experiment', icon: FlaskConical, route: ROUTES.LAB },
    { label: 'Todo', icon: ListTodo, route: ROUTES.TODO },
    { label: 'Settings', icon: Settings, route: ROUTES.SETTINGS }
];

export const GREETING_THRESHOLDS = [
    { maxHour: 12, text: 'Good Morning', emoji: '🌅' },
    { maxHour: 18, text: 'Good Afternoon', emoji: '☀️' },
    { maxHour: 24, text: 'Good Evening', emoji: '🌙' }
];

export const STORAGE_COLOR_THRESHOLDS = [
    { maxPercent: 10, color: COLORS.HOME.STORAGE_CRITICAL }, // Red (< 10% free)
    { maxPercent: 20, color: COLORS.HOME.STORAGE_WARNING },  // Orange (< 20% free)
    { maxPercent: 30, color: COLORS.HOME.STORAGE_CAUTION },  // Yellow (< 30% free)
];
export const STORAGE_DEFAULT_COLOR = COLORS.HOME.STORAGE_OK; // Green (> 30% free)
