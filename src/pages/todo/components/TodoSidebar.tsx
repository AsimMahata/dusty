import React from 'react';
import type { TodoItem } from '../../../types/todo';
import { DEFAULT_CATEGORIES } from '../../../constants/todo';
import { ListTodo } from 'lucide-react';

interface TodoSidebarProps {
    activeCategory: string;
    setActiveCategory: (cat: string) => void;
    todos: TodoItem[];
}

export const TodoSidebar: React.FC<TodoSidebarProps> = ({ activeCategory, setActiveCategory, todos }) => {
    
    const getCount = (catId: string) => {
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

    return (
        <div className="todo-sidebar">
            <div style={{ padding: '8px 16px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Views
            </div>
            {DEFAULT_CATEGORIES.map(cat => (
                <div 
                    key={cat.id} 
                    className={`todo-category-item ${activeCategory === cat.id ? 'active' : ''}`}
                    onClick={() => setActiveCategory(cat.id)}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <ListTodo size={16} />
                        {cat.label}
                    </div>
                    <span className="todo-category-count">{getCount(cat.id)}</span>
                </div>
            ))}
        </div>
    );
};
