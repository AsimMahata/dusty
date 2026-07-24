import type { ITerminalOptions } from "@xterm/xterm"

export const getShellExecutable = (shellName?: string): string => {
    if (!shellName) return 'pwsh.exe';
    const s = shellName.toLowerCase().trim();
    if (s === 'wt') return 'pwsh.exe';
    if (s === 'pwsh') return 'pwsh.exe';
    if (s === 'powershell') return 'powershell.exe';
    if (s === 'cmd') return 'cmd.exe';
    if (s.endsWith('.exe')) return s;
    return `${s}.exe`;
};

export const terminalTheme = {
    background: '#1e1e1e',
    foreground: '#cccccc',
    cursor: '#ffffff',
    cursorAccent: '#000000',
    selectionBackground: '#264f78',
    black: '#000000',
    red: '#cd3131',
    green: '#0dbc79',
    yellow: '#e5e510',
    blue: '#2472c8',
    magenta: '#bc3fbc',
    cyan: '#11a8cd',
    white: '#e5e5e5',
    brightBlack: '#666666',
    brightRed: '#f14c4c',
    brightGreen: '#23d18b',
    brightYellow: '#f5f543',
    brightBlue: '#3b8eea',
    brightMagenta: '#d670d6',
    brightCyan: '#29b8db',
    brightWhite: '#ffffff',
}

export const terminalFontFamily =
    '"Cascadia Code NF", "Cascadia Mono NF", "JetBrainsMono Nerd Font", "FiraCode Nerd Font", "MesloLGS NF", "AnonymicePro Nerd Font", "Symbols Nerd Font", "Nerd Fonts Symbols Non-Mono", "Segoe UI Emoji", "Segoe UI Symbol", "Apple Color Emoji", "Noto Color Emoji", "Cascadia Code", Consolas, monospace';

export const xtermOptions: ITerminalOptions = {
    theme: terminalTheme,
    fontFamily: terminalFontFamily,
    fontSize: 13,
    lineHeight: 1.2,
    letterSpacing: 0,
    cursorBlink: true,
    cursorStyle: 'block',
    customGlyphs: true,
    drawBoldTextInBrightColors: true,
    scrollback: 10000,
    allowProposedApi: true
}
