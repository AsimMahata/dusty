export interface TerminalTab {
    id: string;
    name: string;
    cwd: string;
    history: string[]; // Output lines for simulated mode
    commandHistory: string[]; // Input history for up/down arrow cycling
}
