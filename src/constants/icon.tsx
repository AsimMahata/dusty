import {
    Clock, List, Pin, Eye, CheckCircle, Calendar, PauseCircle, XCircle, RotateCcw, Ban, ShieldCheck, Home as HomeIcon, Tv, FolderGit2, Box, Music as MusicIcon, Film, Image as ImageIcon, Archive, PackageOpen, FolderX,
    ArrowLeft, ExternalLink, X,
    Folder as LucideFolder, File as LucideFile, FileJson, FileCog, FileCode2, FileText, FileImage, FileAudio, FileVideo, FileArchive, Zap, Edit, Edit2,
    Code2, Sparkles, Monitor, Server, Palette, GraduationCap, Coffee, Binary,
    Activity, Pause, CheckCircle2, AlertTriangle, Circle, FileEdit, ArrowUpCircle, ArrowDownCircle, GitPullRequest, AlertOctagon, HelpCircle,
    Folder,
    ArrowUp, BookOpen,
    Settings, Database, Search,
    Terminal as TerminalIcon,
    PlayCircle,
    File,
    Play,
    Check,
    Star,
    FolderOpen,
    CircleDot,
    Terminal,
    Tags,
    Pencil,
    Trash2,
    MoreVertical,
    Tag,
    CheckSquare,
    Square,
    AlertCircle,
    ClipboardList,
    ListTodo,
    Plus,
    ArrowDown,
    ChevronDown,
    Globe,
    EyeOff,
    ArrowRight,
    Menu,
    FlaskConical,
    RefreshCw,
    Copy,
    ChevronLeft,
    Radio,
    ListVideo,
    Grid,
    Save,
    Key,
    Cpu,
    FileCode,
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
        PDF: <FileText size={18} color={COLORS.ICON.PDF} />,
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
        ARCHIVED: <Archive size={14} />,
        VITE: <Zap size={14} />
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
export const NAV_TERMINAL_ICON = <TerminalIcon size={20} />
export const NAV_MUSIC_ICON = <MusicIcon size={20} />
export const NAV_VIDEOS_ICON = <Film size={20} />
export const NAV_IMAGES_ICON = <ImageIcon size={20} />
export const NAV_ZIP_ICON = <Archive size={20} />
export const NAV_PDF_ICON = <BookOpen size={20} />
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


// UI Components
export const SCROLL_TOP_ICON_24 = <ArrowUp size={24} />


// Settings
export const SETTINGS_GENERAL_ICON = <Settings size={24} />
export const SETTINGS_DATA_ICON = <Database size={24} />
export const SETTINGS_DANGER_ICON = <AlertTriangle size={20} />

//Defaults
export const DEFAULT_ICON = <File size={18} />
export const DEFAULT_SHOW_ICON = <PlayCircle size={18} />
export const DEFAULT_FOLDER_ICON = <Folder size={18} />
export const DEFAULT_FILE_ICON = <File size={18} />
export const DEFAULT_TV_ICON = <Tv size={24} />

// Centralized Generic Icons
export const TV_ICON_48 = <Tv size={48} />;
export const PLAY_ICON_12 = <Play size={12} fill="currentColor" />;
export const PLAY_ICON_16 = <Play size={16} />;
export const PLAY_ICON_16_FILL = <Play size={16} fill="currentColor" />;
export const PLAY_ICON_18 = <Play size={18} />;
export const CHECK_ICON_12 = <Check size={12} />;
export const CHECK_ICON_20 = <Check size={20} />;
export const CLOCK_ICON_12 = <Clock size={12} />;
export const FOLDER_ICON_48 = <Folder size={48} color="var(--text-muted)" />;
export const STATUS_DOT_ICON = <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'currentColor' }} />;

export const FOLDER_ICON_28 = <Folder size={28} />;
export const STAR_ICON_12 = <Star size={12} fill="currentColor" />;
export const STAR_ICON_14_MARGIN = <Star size={14} fill="currentColor" style={{ marginRight: '4px', position: 'relative', top: '2px' }} />;
export const STAR_ICON_16 = <Star size={16} fill="currentColor" />;
export const FOLDER_ICON_48_OPACITY = <Folder size={48} opacity={0.8} />;
export const MONITOR_ICON_18 = <Monitor size={18} />;
export const FOLDER_OPEN_ICON_18 = <FolderOpen size={18} />;
export const GLOBE_ICON_18 = <Globe size={18} />;
export const ZAP_ICON_18 = <Zap size={18} />;
export const MORE_VERTICAL_ICON_18 = <MoreVertical size={18} />;
export const ARROW_LEFT_ICON_14 = <ArrowLeft size={14} />;
export const ARROW_LEFT_ICON_20 = <ArrowLeft size={20} />;
export const X_ICON_14 = <X size={14} />;
export const EXTERNAL_LINK_ICON_16 = <ExternalLink size={16} />;
export const STAR_ICON_16_NONE = <Star size={16} fill="none" />;
export const CIRCLE_DOT_ICON_16 = <CircleDot size={16} />;
export const FOLDER_OPEN_ICON_16 = <FolderOpen size={16} />;
export const TERMINAL_ICON_16 = <Terminal size={16} />;
export const MONITOR_ICON_16 = <Monitor size={16} />;
export const GLOBE_ICON_16 = <Globe size={16} />;
export const TAGS_ICON_16 = <Tags size={16} />;
export const PENCIL_ICON_16 = <Pencil size={16} />;
export const TRASH_ICON_16 = <Trash2 size={16} />;

export const CALENDAR_ICON_12 = <Calendar size={12} />;
export const TAG_ICON_12 = <Tag size={12} />;
export const PIN_ICON_14_ACCENT = <Pin size={14} color="var(--accent)" />;
export const CHECK_SQUARE_ICON_20 = <CheckSquare size={20} />;
export const SQUARE_ICON_20 = <Square size={20} />;
export const ALERT_CIRCLE_ICON_12 = <AlertCircle size={12} />;
export const CLIPBOARD_LIST_ICON_48_EMPTY = <ClipboardList size={48} className="todo-empty-icon" />;
export const LIST_TODO_ICON_16 = <ListTodo size={16} />;
export const PLUS_ICON_16 = <Plus size={16} />;
export const CHEVRON_DOWN_ICON_14 = <ChevronDown size={14} />;
export const ARROW_UP_ICON_16 = <ArrowUp size={16} />;
export const ARROW_DOWN_ICON_16 = <ArrowDown size={16} />;

// Edit Icons
export const EDIT2_ICON_16 = <Edit2 size={16} />;

// Visibility Icons
export const EYE_OFF_ICON_16 = <EyeOff size={16} />;
export const CHECK_CIRCLE_2_ICON_16 = <CheckCircle2 size={16} />;
export const CHECK_CIRCLE_2_ICON_14 = <CheckCircle2 size={14} />;
export const CIRCLE_ICON_16 = <Circle size={16} />;
export const CHECK_CIRCLE_2_ICON_16_WATCHED = <CheckCircle2 size={16} color={COLORS.MEDIA.WATCHED} style={{ marginLeft: 8 }} />;
export const EYE_OFF_ICON_16_UNWATCHED = <EyeOff size={16} color={COLORS.MEDIA.UNWATCHED} style={{ marginLeft: 8 }} />;

// Navigation & UI Icons
export const ARROW_RIGHT_ICON_16 = <ArrowRight size={16} />;
export const CHEVRON_LEFT_ICON_24 = <ChevronLeft size={24} />;
export const MENU_ICON_20 = <Menu size={20} />;

// Header/Layout Icons
export const FLASK_CONICAL_ICON_20 = <FlaskConical size={20} />;
export const FLASK_CONICAL_ICON_24 = <FlaskConical size={24} />;
export const REFRESH_CW_ICON_20 = <RefreshCw size={20} />;

// Action Icons
export const COPY_ICON_14 = <Copy size={14} />;
export const ROTATE_CCW_ICON_12 = <RotateCcw size={12} />;
export const SAVE_ICON_16 = <Save size={16} />;

// Show/Media Icons
export const RADIO_ICON_14 = <Radio size={14} />;
export const LIST_VIDEO_ICON_14 = <ListVideo size={14} />;
export const CLOCK_ICON_14 = <Clock size={14} />;
export const FOLDER_ICON_14 = <Folder size={14} />;
export const CALENDAR_ICON_14 = <Calendar size={14} />;
export const PLAY_ICON_14 = <Play size={14} fill="currentColor" />;
export const CHECK_ICON_14 = <Check size={14} />;

// Layout Icons
export const LIST_ICON_16 = <List size={16} />;
export const GRID_ICON_16 = <Grid size={16} />;

// Lab Icons
export const KEY_ICON_16 = <Key size={16} />;
export const KEY_ICON_20 = <Key size={20} />;
export const CPU_ICON_16 = <Cpu size={16} />;
export const FILE_CODE_ICON_16 = <FileCode size={16} />;
export const DATABASE_ICON_16 = <Database size={16} />;
export const ALERT_CIRCLE_ICON_14 = <AlertCircle size={14} />;
export const CHECK_CIRCLE_2_ICON_14_LAB = <CheckCircle2 size={14} />;

// Search
export const SEARCH_ICON_18 = <Search size={18} />;

// Terminal
export const TERMINAL_ICON_14 = <Terminal size={14} />;
export const TERMINAL_ICON_32 = <Terminal size={32} />;

// File Text
export const FILE_TEXT_ICON_13 = <FileText size={13} />;

// Shows
export const STAR_ICON_12_CLASS = <Star size={12} className="star-icon" />;
export const STAR_ICON_16_CLASS = <Star size={16} className="star-icon" />;
export const TV_ICON_32 = <Tv size={32} />;
export const TV_ICON_48_MUTED = <Tv size={48} color="var(--text-muted)" />;

// Plus
export const PLUS_ICON_18 = <Plus size={18} />;
export const CHECK_ICON_18 = <Check size={18} />;
export const X_ICON_20 = <X size={20} />;
export const X_ICON_12 = <X size={12} />;
export const X_ICON_24 = <X size={24} />;
export const SEARCH_ICON_16_CLASS = <Search size={16} className="search-icon" />;
export const MORE_VERTICAL_ICON_16 = <MoreVertical size={16} />;
export const CHECK_CIRCLE_2_ICON_16_CLASS = <CheckCircle2 size={16} />;

export const PALETTE_ICON_20_ACCENT = <Palette size={20} style={{ color: 'var(--accent)' }} />;
export const CHECK_ICON_14_GREEN = <Check size={14} style={{ color: COLORS.LAB.GREEN }} />;
export const COPY_ICON_14_MUTED = <Copy size={14} style={{ color: 'var(--text-muted)' }} />;

export const KEY_ICON_20_ACCENT = <Key size={20} style={{ color: 'var(--accent)' }} />;

export const ARROW_UP_ICON_16_CLASS = <ArrowUp size={16} />;

// PageLayout Icons
export const SEARCH_ICON_16_SEARCH = <Search size={16} className="search-icon" />;
export const X_ICON_24_SECONDARY = <X size={24} style={{ cursor: 'pointer', color: 'var(--text-secondary)' }} />;
export const FLASK_CONICAL_ICON_20_POINTER = <FlaskConical size={20} style={{ cursor: 'pointer' }} />;
export const LIST_TODO_ICON_20_POINTER = <ListTodo size={20} style={{ cursor: 'pointer' }} />;
export const SETTINGS_ICON_20_POINTER = <Settings size={20} style={{ cursor: 'pointer' }} />;
export const getRefreshCwIcon = (isRefreshing: boolean) => (
    <RefreshCw size={20} style={{ cursor: 'pointer' }} className={isRefreshing ? 'spin-animation' : ''} />
);

export const ROTATE_CCW_ICON_12_HISTORY = <RotateCcw size={12} className="api-history-time" />;


