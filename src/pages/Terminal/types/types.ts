export interface TerminalTab {
    id: string;
    name: string;
    active: boolean;
    shell?: string;
}

export type TerminalOptions = {
    cwd?: string,
    cols: number,
    rows: number,
    name: string
}

