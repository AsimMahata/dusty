export const DEFAULT_CWD = 'C:\\Users\\asim\\projects\\dusty';
export const TERMINAL_WELCOME_MSG = [
    'Welcome to Dusty Terminal v0.1.0',
    'Type "help" for a list of available mock commands.',
    'For now, assume this is a simulated and responsive sandbox terminal.',
    ''
].join('\r\n');

export const MOCK_COMMANDS = {
    HELP: 'help',
    CLEAR: 'clear',
    NEOFETCH: 'neofetch',
    LS: 'ls',
    ABOUT: 'about',
    DATE: 'date',
    CD: 'cd',
} as const;

export type MockCommand = typeof MOCK_COMMANDS[keyof typeof MOCK_COMMANDS];

export const MOCK_FILE_SYSTEM: Record<string, string[]> = {
    'C:\\Users\\asim\\projects\\dusty': ['src', 'public', 'node_modules', 'package.json', 'vite.config.ts', 'tsconfig.json', 'README.md'],
    'C:\\Users\\asim\\projects\\dusty\\src': ['components', 'pages', 'hooks', 'contexts', 'App.tsx', 'main.tsx'],
    'C:\\Users\\asim\\projects\\dusty\\public': ['favicon.ico', 'icon.png', 'banner.jpg']
};
