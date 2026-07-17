export type TodoPriority = 'Low' | 'Medium' | 'High';

export interface TodoItem {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    pinned: boolean;
    priority: TodoPriority;
    category: string;
    createdAt: number;
    updatedAt: number;
    dueDate?: number;
}

export type SortMethod = 'created' | 'updated' | 'alpha' | 'priority' | 'due' | 'pinned';
export type SortDirection = 'asc' | 'desc';

export interface TodoCategory {
    id: string;
    label: string;
}
