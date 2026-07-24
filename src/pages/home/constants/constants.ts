import { Tv, Folder, Music, Film, FlaskConical, Settings, ListTodo } from 'lucide-react';
import { ROUTES } from '../../../constants/routes';

export const HOME_STATS_CONFIG = [
    {
        label: 'Shows',
        key: 'shows' as const,
        icon: Tv,
        color: '#a78bfa',
        bgColor: 'rgba(167, 139, 250, 0.1)',
        route: ROUTES.SHOWS,
    },
    {
        label: 'Projects',
        key: 'projects' as const,
        icon: Folder,
        color: '#34d399',
        bgColor: 'rgba(52, 211, 153, 0.1)',
        route: ROUTES.PROJECTS,
    },
    {
        label: 'Songs',
        key: 'songs' as const,
        icon: Music,
        color: '#f43f5e',
        bgColor: 'rgba(244, 63, 94, 0.1)',
        route: ROUTES.MUSIC,
    },
    {
        label: 'Videos',
        key: 'videos' as const,
        icon: Film,
        color: '#60a5fa',
        bgColor: 'rgba(96, 165, 250, 0.1)',
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
    { maxPercent: 10, color: '#ef4444' }, // Red (< 10% free)
    { maxPercent: 20, color: '#f97316' }, // Orange (< 20% free)
    { maxPercent: 30, color: '#fbbf24' }, // Yellow (< 30% free)
];
export const STORAGE_DEFAULT_COLOR = '#34d399'; // Green (> 30% free)
