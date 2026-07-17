import React from 'react';
import type { TodoItem } from '../../../../types/todo';
import { DEFAULT_CATEGORIES } from '../../../../constants/todo';
import { getTodoCount } from '../../actions/counts';
import { TODO_LIST_TODO_ICON } from '../../../../constants/icon';

interface TodoSidebarProps {
    activeCategory: string;
    setActiveCategory: (cat: string) => void;
    todos: TodoItem[];
}

export const TodoSidebar: React.FC<TodoSidebarProps> = ({ activeCategory, setActiveCategory, todos }) => {
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
                        {TODO_LIST_TODO_ICON}
                        {cat.label}
                    </div>
                    <span className="todo-category-count">{getTodoCount(cat.id, todos)}</span>
                </div>
            ))}
        </div>
    );
};
