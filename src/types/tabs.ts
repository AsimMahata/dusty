export interface Tab {
    title: string,
    type: TabType
}
export type TabType =
    | "normal"
    | "banned"
    | "media"
    | "folders"
    | "music"
    | "images"
    | "videos";


