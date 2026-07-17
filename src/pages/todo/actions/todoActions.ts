import type { TodoItem } from '../../../types/todo';

export const getTodoCardActions = (
    todo: TodoItem, 
    onEdit: () => void, 
    onTogglePin: () => void, 
    onToggleComplete: () => void, 
    onDuplicate: () => void, 
    onDelete: () => void
) => {
    return [
        { label: 'Edit', onClick: onEdit },
        { label: todo.pinned ? 'Unpin' : 'Pin', onClick: onTogglePin },
        { label: todo.completed ? 'Mark Active' : 'Mark Complete', onClick: onToggleComplete },
        { label: 'Duplicate', onClick: onDuplicate },
        { label: 'Delete', onClick: onDelete, color: 'var(--accent-red, #ef4444)' }
    ];
};
