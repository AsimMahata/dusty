import type { TodoItem } from '../../../types/todo';

export const getTodoCount = (catId: string, todos: TodoItem[]): number => {
    if (catId === 'all') return todos.length;
    if (catId === 'completed') return todos.filter(t => t.completed).length;
    if (catId === 'pinned') return todos.filter(t => t.pinned).length;
    
    if (catId === 'today') {
        const today = new Date();
        today.setHours(0,0,0,0);
        return todos.filter(t => {
            if (!t.dueDate) return false;
            const d = new Date(t.dueDate);
            d.setHours(0,0,0,0);
            return d.getTime() === today.getTime();
        }).length;
    }
    
    if (catId === 'upcoming') {
        const today = new Date();
        today.setHours(0,0,0,0);
        return todos.filter(t => {
            if (!t.dueDate) return false;
            const d = new Date(t.dueDate);
            d.setHours(0,0,0,0);
            return d.getTime() > today.getTime();
        }).length;
    }
    
    return todos.filter(t => t.category === catId).length;
};
