import { 
    Clock, List, Pin, Eye, CheckCircle, Calendar, PauseCircle, XCircle, RotateCcw, Ban, ShieldCheck, Home as HomeIcon, Tv, FolderGit2, Box, Music as MusicIcon, Film, Image as ImageIcon, Archive, PackageOpen, FolderX,
    ArrowLeft, ExternalLink, X,
    Folder as LucideFolder, File as LucideFile, FileJson, FileCog, FileCode2, FileText, FileImage, FileAudio, FileVideo, FileArchive, Zap, Edit,
    Code2, Sparkles, Monitor, Server, Palette, GraduationCap, Coffee, Binary,
    Activity, Pause, CheckCircle2, AlertTriangle, Circle, FileEdit, ArrowUpCircle, ArrowDownCircle, GitPullRequest, AlertOctagon, HelpCircle,
    Play,
    Check,
    Folder,
    Star, FolderOpen, Globe, MoreVertical,
    ArrowUp, CircleDot, Terminal, Tags, Pencil, Trash2,
    Tag, CheckSquare, Square, AlertCircle, ClipboardList, ListTodo, Plus, ChevronDown, ArrowDown,
    Settings, Database, Search
} from "lucide-react";
import { COLORS } from './color';

export const ICONS = {
    GENERAL: {
        CLOCK: <Clock size={20} />,
        LIST: <List size={20} />,
        ARROW_LEFT: <ArrowLeft size={20} />,
        EXTERNAL_LINK: <ExternalLink size={16} />,
        X: <X size={20} />,
        EDIT: <Edit size={20} />,
    },
    FILE: {
        FOLDER: <LucideFolder size={18} color={COLORS.ICON.FOLDER} className="folder-icon" />,
        JSON: <FileJson size={18} color={COLORS.ICON.JSON} />,
        CONFIG: <FileCog size={18} color={COLORS.ICON.CONFIG} />,
        MARKDOWN: <FileText size={18} color={COLORS.ICON.MARKDOWN} />,
        VITE: <Zap size={18} color={COLORS.ICON.VITE} />,
        HTML: <FileCode2 size={18} color={COLORS.ICON.HTML} />,
        CSS: <FileCode2 size={18} color={COLORS.ICON.CSS} />,
        JS: <FileCode2 size={18} color={COLORS.ICON.JS} />,
        TS: <FileCode2 size={18} color={COLORS.ICON.TS} />,
        IMAGE: <FileImage size={18} color={COLORS.ICON.IMAGE} />,
        AUDIO: <FileAudio size={18} color={COLORS.ICON.AUDIO} />,
        VIDEO: <FileVideo size={18} color={COLORS.ICON.VIDEO} />,
        ARCHIVE: <FileArchive size={20} color={COLORS.ICON.ARCHIVE} />,
        ARCHIVE_OPEN: <PackageOpen size={20} color={COLORS.ICON.ARCHIVE} />,
        FOLDER_EMPTY: <FolderX size={20} color={COLORS.ICON.FOLDER} />,
        DEFAULT: <LucideFile size={20} color={COLORS.ICON.DEFAULT} />,
    },
    MEDIA_FOLDER: {
        MUSIC: <MusicIcon size={18} />,
        VIDEO: <Film size={18} />,
        IMAGE: <ImageIcon size={18} />
    },
    PROJECT_TAGS: {
        RUST: <Box size={14} />,
        REACT: <Code2 size={14} />,
        TAURI: <Sparkles size={14} />,
        PYTHON: <FileJson size={14} />,
        AI: <Binary size={14} />,
        MACHINE_LEARNING: <Binary size={14} />,
        GAME: <Coffee size={14} />,
        DESKTOP: <Monitor size={14} />,
        BACKEND: <Server size={14} />,
        FRONTEND: <Palette size={14} />,
        PERSONAL: <HomeIcon size={14} />,
        COLLEGE: <GraduationCap size={14} />,
        ARCHIVED: <Archive size={14} />
    },
    PROJECT_STATUSES: {
        ACTIVE: <Activity size={16} />,
        PAUSED: <Pause size={16} />,
        COMPLETED: <CheckCircle2 size={16} />,
        ARCHIVED: <Archive size={16} />,
        BROKEN: <AlertTriangle size={16} />,
        DEFAULT: <Circle size={16} />,
        GIT_CLEAN: <CheckCircle size={16} />,
        GIT_MODIFIED: <FileEdit size={16} />,
        GIT_AHEAD: <ArrowUpCircle size={16} />,
        GIT_BEHIND: <ArrowDownCircle size={16} />,
        GIT_DIVERGED: <GitPullRequest size={16} />,
        GIT_CONFLICT: <AlertOctagon size={16} />,
        GIT_NONE: <HelpCircle size={16} />
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
export const SEARCH_ICON_16 = <Search size={16} />

//SHOWS
export const SHOW_PAGE_FALLBACK_ICON = <Tv className="show-grid-fallback-icon" size={48} />
export const SHOW_WATCHING_ICON = <Play size={12} fill="currentColor" />
export const SHOW_COMPLETED_ICON = <Check size={12} />
export const SHOW_PLANNED_ICON = <Clock size={12} />
export const SHOW_DEFAULT_STATUS_ICON = <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'currentColor' }} />

//Episodes
export const NO_EPISODE_AVAILABLE_ICON = <Folder size={48} color="var(--text-muted)" />
export const NO_EPISODE_AVAILABLE_P_TEXT = <p>No episodes found.</p>
export const EPISODE_PLAY_ICON_18 = <Play size={18} />

// Projects
export const PROJECT_BANNER_FOLDER_ICON = <Folder size={28} />
export const PROJECT_PINNED_STAR_ICON_12 = <Star size={12} fill="currentColor" />
export const PROJECT_PINNED_STAR_ICON_14 = <Star size={14} fill="currentColor" style={{ marginRight: '4px', position: 'relative', top: '2px' }}/>
export const PROJECT_PINNED_STAR_ICON_16 = <Star size={16} fill="currentColor" />
export const PROJECT_FALLBACK_FOLDER_ICON_48 = <Folder size={48} opacity={0.8} />
export const PROJECT_OPEN_VSCODE_ICON = <Monitor size={18} />
export const PROJECT_OPEN_EXPLORER_ICON = <FolderOpen size={18} />
export const PROJECT_OPEN_GITHUB_ICON = <Globe size={18} />
export const PROJECT_OPEN_ZAP_ICON = <Zap size={18} />
export const PROJECT_MENU_MORE_ICON = <MoreVertical size={18} />
export const PROJECT_BACK_ARROW_ICON = <ArrowLeft size={14} />
export const PROJECT_CLOSE_X_ICON = <X size={14} />
export const PROJECT_EXTERNAL_LINK_ICON = <ExternalLink size={16} />

export const PROJECT_MENU_STAR_ICON = <Star size={16} fill="none" />
export const PROJECT_MENU_STAR_FILLED_ICON = <Star size={16} fill="currentColor" />
export const PROJECT_MENU_STATUS_ICON = <CircleDot size={16} />
export const PROJECT_MENU_EXPLORER_ICON = <FolderOpen size={16} />
export const PROJECT_MENU_TERMINAL_ICON = <Terminal size={16} />
export const PROJECT_MENU_VSCODE_ICON = <Monitor size={16} />
export const PROJECT_MENU_GITHUB_ICON = <Globe size={16} />
export const PROJECT_MENU_TAGS_ICON = <Tags size={16} />
export const PROJECT_MENU_RENAME_ICON = <Pencil size={16} />
export const PROJECT_MENU_DELETE_ICON = <Trash2 size={16} />

// UI Components
export const SCROLL_TOP_ICON_24 = <ArrowUp size={24} />

// Todo
export const TODO_MORE_VERTICAL_ICON = <MoreVertical size={18} />
export const TODO_CALENDAR_ICON = <Calendar size={12} />
export const TODO_TAG_ICON = <Tag size={12} />
export const TODO_PIN_ICON = <Pin size={14} color="var(--accent)" />
export const TODO_CHECK_SQUARE_ICON = <CheckSquare size={20} />
export const TODO_SQUARE_ICON = <Square size={20} />
export const TODO_ALERT_CIRCLE_ICON = <AlertCircle size={12} />
export const TODO_CLIPBOARD_LIST_ICON = <ClipboardList size={48} className="todo-empty-icon" />
export const TODO_LIST_TODO_ICON = <ListTodo size={16} />
export const TODO_PLUS_ICON = <Plus size={16} />
export const TODO_CHEVRON_DOWN_ICON = <ChevronDown size={14} />
export const TODO_ARROW_UP_ICON = <ArrowUp size={16} />
export const TODO_ARROW_DOWN_ICON = <ArrowDown size={16} />

// Settings
export const SETTINGS_GENERAL_ICON = <Settings size={24} />
export const SETTINGS_DATA_ICON = <Database size={24} />
export const SETTINGS_DANGER_ICON = <AlertTriangle size={20} />