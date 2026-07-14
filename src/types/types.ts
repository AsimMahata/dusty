export interface FileInfo {
    name: string,
    path: string,
    size: number,
    ext?: string,
    is_dir: boolean,
}
export interface ShowResult {
    id: string,
    title: string,
    num_episodes: number,
    episodes: FileInfo[],
    dir: string,
    is_banned?: boolean
}

export type ProjectType = "C/C++" | "Unknown";

export interface Project {
    title: string,
    path: string,
    project_type: ProjectType,
}

