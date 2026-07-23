import { ROUTES } from './routes';
import { NAV_HOME_ICON, NAV_SHOWS_ICON, NAV_PROJECTS_ICON, NAV_MUSIC_ICON, NAV_VIDEOS_ICON, NAV_IMAGES_ICON, NAV_ZIP_ICON, NAV_PDF_ICON, NAV_MISC_ICON, NAV_TERMINAL_ICON } from './icon';

// Sidebar Navigation Configuration
export const SIDEBAR_NAV_ITEMS = [
    { label: 'Home', path: ROUTES.HOME, icon: NAV_HOME_ICON },
    { label: 'Shows', path: ROUTES.SHOWS, icon: NAV_SHOWS_ICON },
    { label: 'Projects', path: ROUTES.PROJECTS, icon: NAV_PROJECTS_ICON },
    { label: 'Terminal', path: ROUTES.TERMINAL, icon: NAV_TERMINAL_ICON },
    { label: 'Music', path: ROUTES.MUSIC, icon: NAV_MUSIC_ICON },
    { label: 'Videos', path: ROUTES.VIDEOS, icon: NAV_VIDEOS_ICON },
    { label: 'Images', path: ROUTES.IMAGES, icon: NAV_IMAGES_ICON },
    { label: 'Zip', path: ROUTES.ZIP, icon: NAV_ZIP_ICON },
    { label: 'PDF', path: ROUTES.PDF, icon: NAV_PDF_ICON },
    { label: 'Misc', path: ROUTES.MISC, icon: NAV_MISC_ICON },
];


