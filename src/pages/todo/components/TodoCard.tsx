import React, { useState } from 'react';
import type { TodoItem } from '../../../types/todo';
import { PRIORITY_COLORS } from '../../../constants/todo';
import { MoreVertical, Calendar, Tag, Pin, CheckSquare, Square, AlertCircle } from 'lucide-react';
import { ContextMenu } from '../../../components/ui/ContextMenu';

interface TodoCardProps {
    todo: TodoItem;
    onEdit: () => void;
    onToggleComplete: () => void;
    onTogglePin: () => void;
    onDuplicate: () => void;
    onDelete: () => void;
}

export const TodoCard: React.FC<TodoCardProps> = ({ 
    todo, onEdit, onToggleComplete, onTogglePin, onDuplicate, onDelete 
}) => {
    const [menuPos, setMenuPos] = useState<{x: number, y: number} | null>(null);

    const handleMenuClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        const rect = e.currentTarget.getBoundingClientRect();
        setMenuPos({ x: rect.left - 150, y: rect.bottom + 4 });
    };

    const formatDate = (ts: number) => {
        return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    };

    const isOverdue = todo.dueDate && todo.dueDate < Date.now() && !todo.completed;

    const priorityColor = PRIORITY_COLORS[todo.priority] || PRIORITY_COLORS.Medium;

    return (
        <div className={`todo-card ${todo.completed ? 'completed' : ''}`}>
            <div className="todo-checkbox" onClick={onToggleComplete} title="Toggle Completion">
                {todo.completed ? <CheckSquare size={20} /> : <Square size={20} />}
            </div>
            
            <div className="todo-content">
                <h4 className="todo-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {todo.pinned && <Pin size={14} color="var(--accent)" />}
                    {todo.title}
                </h4>
                {todo.description && (
                    <p className="todo-description">{todo.description}</p>
                )}
                <div className="todo-badges">
                    <span className="todo-badge priority" style={{ color: priorityColor, border: `1px solid ${priorityColor}40` }}>
                        <AlertCircle size={12} /> {todo.priority}
                    </span>
                    {todo.category && (
                        <span className="todo-badge">
                            <Tag size={12} /> {todo.category}
                        </span>
                    )}
                    {todo.dueDate && (
                        <span className="todo-badge" style={{ color: isOverdue ? 'var(--accent-red, #ef4444)' : 'inherit' }}>
                            <Calendar size={12} /> {formatDate(todo.dueDate)}
                        </span>
                    )}
                </div>
            </div>

            <div className="todo-actions">
                <button className="todo-action-btn" onClick={handleMenuClick} title="More Options">
                    <MoreVertical size={18} />
                </button>
            </div>

            {menuPos && (
                <ContextMenu 
                    x={menuPos.x} 
                    y={menuPos.y} 
                    actions={[
                        { label: 'Edit', onClick: onEdit },
                        { label: todo.pinned ? 'Unpin' : 'Pin', onClick: onTogglePin },
                        { label: todo.completed ? 'Mark Active' : 'Mark Complete', onClick: onToggleComplete },
                        { label: 'Duplicate', onClick: onDuplicate },
                        { label: 'Delete', onClick: onDelete, color: 'var(--accent-red, #ef4444)' }
                    ]}
                    onClose={() => setMenuPos(null)}
                />
            )}
        </div>
    );
};
