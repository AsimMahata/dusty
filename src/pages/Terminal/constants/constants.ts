import type { ITerminalOptions } from "@xterm/xterm"
import { COLORS } from '../../../constants/color';

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

export const terminalTheme = COLORS.TERMINAL_THEME;

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
