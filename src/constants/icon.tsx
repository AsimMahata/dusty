import { 
    Clock, List, Pin, Eye, CheckCircle, Calendar, PauseCircle, XCircle, RotateCcw, Ban, ShieldCheck, Home as HomeIcon, Tv, FolderGit2, Box, Music as MusicIcon, Film, Image as ImageIcon, Archive,
    ArrowLeft, ExternalLink, X,
    Folder as LucideFolder, File as LucideFile, FileJson, FileCog, FileCode2, FileText, FileImage, FileAudio, FileVideo, FileArchive, Zap
} from "lucide-react";
import { 
    COLOR_ICON_FOLDER,
    COLOR_ICON_JSON,
    COLOR_ICON_CONFIG,
    COLOR_ICON_MARKDOWN,
    COLOR_ICON_VITE,
    COLOR_ICON_HTML,
    COLOR_ICON_CSS,
    COLOR_ICON_JS,
    COLOR_ICON_TS,
    COLOR_ICON_IMAGE,
    COLOR_ICON_AUDIO,
    COLOR_ICON_VIDEO,
    COLOR_ICON_ARCHIVE,
    COLOR_ICON_DEFAULT
} from './color';

export const ICONS = {
    GENERAL: {
        CLOCK: <Clock size={20} />,
        LIST: <List size={20} />,
        ARROW_LEFT: <ArrowLeft size={20} />,
        EXTERNAL_LINK: <ExternalLink size={16} />,
        X: <X size={20} />,
    },
    FILE: {
        FOLDER: <LucideFolder size={18} color={COLOR_ICON_FOLDER} className="folder-icon" />,
        JSON: <FileJson size={18} color={COLOR_ICON_JSON} />,
        CONFIG: <FileCog size={18} color={COLOR_ICON_CONFIG} />,
        MARKDOWN: <FileText size={18} color={COLOR_ICON_MARKDOWN} />,
        VITE: <Zap size={18} color={COLOR_ICON_VITE} />,
        HTML: <FileCode2 size={18} color={COLOR_ICON_HTML} />,
        CSS: <FileCode2 size={18} color={COLOR_ICON_CSS} />,
        JS: <FileCode2 size={18} color={COLOR_ICON_JS} />,
        TS: <FileCode2 size={18} color={COLOR_ICON_TS} />,
        IMAGE: <FileImage size={18} color={COLOR_ICON_IMAGE} />,
        AUDIO: <FileAudio size={18} color={COLOR_ICON_AUDIO} />,
        VIDEO: <FileVideo size={18} color={COLOR_ICON_VIDEO} />,
        ARCHIVE: <FileArchive size={18} color={COLOR_ICON_ARCHIVE} />,
        DEFAULT: <LucideFile size={18} color={COLOR_ICON_DEFAULT} />,
    },
    MEDIA_FOLDER: {
        MUSIC: <MusicIcon size={18} />,
        VIDEO: <Film size={18} />,
        IMAGE: <ImageIcon size={18} />
    }
};

// Navigation Icons (20px)
export const NAV_HOME_ICON = <HomeIcon size={20} />
export const NAV_SHOWS_ICON = <Tv size={20} />
export const NAV_PROJECTS_ICON = <FolderGit2 size={20} />
export const NAV_MUSIC_ICON = <MusicIcon size={20} />
export const NAV_VIDEOS_ICON = <Film size={20} />
export const NAV_IMAGES_ICON = <ImageIcon size={20} />
export const NAV_ZIP_ICON = <Archive size={20} />
export const NAV_MISC_ICON = <Box size={20} />

// Action Icons (16px)
export const PIN_ICON_16 = <Pin size={16} />
export const EYE_ICON_16 = <Eye size={16} />
export const CHECK_CIRCLE_ICON_16 = <CheckCircle size={16} />
export const CALENDAR_ICON_16 = <Calendar size={16} />
export const PAUSE_CIRCLE_ICON_16 = <PauseCircle size={16} />
export const X_CIRCLE_ICON_16 = <XCircle size={16} />
export const ROTATE_CCW_ICON_16 = <RotateCcw size={16} />
export const BAN_ICON_16 = <Ban size={16} />
export const SHIELD_CHECK_ICON_16 = <ShieldCheck size={16} />

// Micro Icons (12px)
export const PIN_ICON_12 = <Pin size={12} />
