import React from 'react';
import type { TodoItem } from '../../../types/todo';
import { TodoCard } from './TodoCard';
import { ClipboardList } from 'lucide-react';

interface TodoListProps {
    todos: TodoItem[];
    onEdit: (item: TodoItem) => void;
    onToggleComplete: (id: string, current: boolean) => void;
    onTogglePin: (id: string, current: boolean) => void;
    onDuplicate: (item: TodoItem) => void;
    onDelete: (id: string) => void;
}

export const TodoList: React.FC<TodoListProps> = ({ 
    todos, onEdit, onToggleComplete, onTogglePin, onDuplicate, onDelete 
}) => {
    
    if (todos.length === 0) {
        return (
            <div className="todo-empty-state">
                <ClipboardList size={48} className="todo-empty-icon" />
                <div>
                    <h3 style={{ margin: '0 0 8px 0', color: 'var(--text-primary)' }}>No tasks found</h3>
                    <p style={{ margin: 0 }}>Try adjusting your filters or create a new task.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="todo-list-container">
            {todos.map(todo => (
                <TodoCard 
                    key={todo.id} 
                    todo={todo}
                    onEdit={() => onEdit(todo)}
                    onToggleComplete={() => onToggleComplete(todo.id, todo.completed)}
                    onTogglePin={() => onTogglePin(todo.id, todo.pinned)}
                    onDuplicate={() => onDuplicate(todo)}
                    onDelete={() => onDelete(todo.id)}
                />
            ))}
        </div>
    );
};
