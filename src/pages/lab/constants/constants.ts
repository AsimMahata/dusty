export { COLOR_TOKENS } from '../../../constants/color';

export interface LabTab {
    id: string;
    label: string;
    description: string;
    category: 'core' | 'database' | 'system' | 'utils';
}

export const LAB_TABS: LabTab[] = [
    { id: 'api', label: 'IPC Console', description: 'Interactive IPC API command runner & JSON inspector', category: 'core' },
    { id: 'database', label: 'Database Browser', description: 'Inspect SQLite tables, row data, and schema stats', category: 'database' },
    { id: 'system', label: 'System Monitor', description: 'Live CPU, Memory, Disk usage, and process details', category: 'system' },
    { id: 'tokenizer', label: 'Tokenizer Suite', description: 'Filename and string token parser test utility', category: 'utils' },
    { id: 'session', label: 'Session Keys', description: 'SQLite session storage inspector and value updates', category: 'database' },
    { id: 'theme', label: 'Theme Inspector', description: 'Color palette, design system tokens, and typography preview', category: 'utils' },
];

export interface IpcCommandPreset {
    name: string;
    command: string;
    description: string;
    defaultArgs: Record<string, any>;
}

export const PRESET_IPC_COMMANDS: IpcCommandPreset[] = [
    {
        name: 'Get All Table Data',
        command: 'get_all_table_data',
        description: 'Retrieves all tables and rows from the SQLite database',
        defaultArgs: {}
    },
    {
        name: 'Tokenize String',
        command: 'tokenize',
        description: 'Parses a filename or string into tokenized tags',
        defaultArgs: { input: '[Frieren] Episode 18 1080p.mkv' }
    },
    {
        name: 'Get System Info',
        command: 'get_system_info',
        description: 'Fetches OS, CPU, Memory, Disks, and Process info',
        defaultArgs: {}
    },
    {
        name: 'Scan Shows',
        command: 'scan_shows',
        description: 'Triggers a media scan for anime and TV shows',
        defaultArgs: {}
    },
    {
        name: 'Get Projects',
        command: 'get_projects',
        description: 'Fetches list of registered projects',
        defaultArgs: {}
    },
    {
        name: 'Scan Empty Directories',
        command: 'scan_empty_dir',
        description: 'Scans filesystem for empty folders',
        defaultArgs: {}
    },
    {
        name: 'Get Session Value',
        command: 'get_value_by_session_id',
        description: 'Reads a value from SQLite session storage by session ID',
        defaultArgs: { id: 'default_terminal' }
    },
    {
        name: 'Reset Database',
        command: 'reset_database',
        description: 'Resets database tables to initial schema',
        defaultArgs: {}
    }
];

