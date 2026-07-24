import type { TodoItem } from '../types/types';

export const isTodoOverdue = (todo: TodoItem): boolean => {
    return !!todo.dueDate && todo.dueDate < Date.now() && !todo.completed;
};

export const formatTodoDate = (ts: number): string => {
    return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};
