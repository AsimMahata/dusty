import React, { useState } from 'react';
import type { TodoItem } from '../../../../../types/todo';
import { PRIORITY_COLORS } from '../../../../../constants/todo';
import { ContextMenu } from '../../../../../components/ui/ContextMenu';
import { isTodoOverdue, formatTodoDate } from '../../../actions/todoInfo';
import { getTodoCardActions } from '../../../actions/todoActions';
import { 
    TODO_PIN_ICON, TODO_ALERT_CIRCLE_ICON, TODO_TAG_ICON, TODO_CALENDAR_ICON, 
    TODO_MORE_VERTICAL_ICON, TODO_CHECK_SQUARE_ICON, TODO_SQUARE_ICON 
} from '../../../../../constants/icon';

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

    const isOverdue = isTodoOverdue(todo);
    const priorityColor = PRIORITY_COLORS[todo.priority] || PRIORITY_COLORS.Medium;

    return (
        <div className={`todo-card ${todo.completed ? 'completed' : ''}`}>
            <div className="todo-checkbox" onClick={onToggleComplete} title="Toggle Completion">
                {todo.completed ? TODO_CHECK_SQUARE_ICON : TODO_SQUARE_ICON}
            </div>
            
            <div className="todo-content">
                <h4 className="todo-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {todo.pinned && TODO_PIN_ICON}
                    {todo.title}
                </h4>
                {todo.description && (
                    <p className="todo-description">{todo.description}</p>
                )}
                <div className="todo-badges">
                    <span className="todo-badge priority" style={{ color: priorityColor, border: `1px solid ${priorityColor}40` }}>
                        {TODO_ALERT_CIRCLE_ICON} {todo.priority}
                    </span>
                    {todo.category && (
                        <span className="todo-badge">
                            {TODO_TAG_ICON} {todo.category}
                        </span>
                    )}
                    {todo.dueDate && (
                        <span className="todo-badge" style={{ color: isOverdue ? 'var(--accent-red, #ef4444)' : 'inherit' }}>
                            {TODO_CALENDAR_ICON} {formatTodoDate(todo.dueDate)}
                        </span>
                    )}
                </div>
            </div>

            <div className="todo-actions">
                <button className="todo-action-btn" onClick={handleMenuClick} title="More Options">
                    {TODO_MORE_VERTICAL_ICON}
                </button>
            </div>

            {menuPos && (
                <ContextMenu 
                    x={menuPos.x} 
                    y={menuPos.y} 
                    actions={getTodoCardActions(todo, onEdit, onTogglePin, onToggleComplete, onDuplicate, onDelete)}
                    onClose={() => setMenuPos(null)}
                />
            )}
        </div>
    );
};
