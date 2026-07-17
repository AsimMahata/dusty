import type { ReactNode } from 'react';


export interface MediaSourceItem {
    id: string;
    title: string;
    subtitle?: string;
    path?: string;
    icon?: ReactNode;
    size?: string;
    rawSize?: number;
    metadata?: string;
    is_dir?: boolean;
}


export type MediaSourceCategory = 'video' | 'music' | 'image';
