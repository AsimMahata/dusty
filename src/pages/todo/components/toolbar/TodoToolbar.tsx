import React, { useState } from 'react';
import { useTodo } from '../../../../hooks/todo/useTodo';
import { ContextMenu } from '../../../../components/ui/ContextMenu';
import { SORT_LABELS } from '../../constants/constants';
import { getToolbarSortActions } from '../../actions/toolbarActions';
import { 
    TODO_PLUS_ICON, TODO_CHEVRON_DOWN_ICON, 
    TODO_ARROW_UP_ICON, TODO_ARROW_DOWN_ICON 
} from '../../../../constants/icon';

interface TodoToolbarProps {
    todo: ReturnType<typeof useTodo>;
    onCreateNew: () => void;
}

export const TodoToolbar: React.FC<TodoToolbarProps> = ({ todo, onCreateNew }) => {
    const [sortMenuPos, setSortMenuPos] = useState<{x: number, y: number} | null>(null);

    return (
        <div className="todo-toolbar">
            <div className="todo-toolbar-left">
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    {todo.filteredTodos.length} Tasks
                </div>
            </div>
            <div className="todo-toolbar-right">
                <button 
                    className="todo-sort-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        if (sortMenuPos) setSortMenuPos(null);
                        else {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setSortMenuPos({ x: rect.left, y: rect.bottom + 4 });
                        }
                    }}
                >
                    <span style={{ color: 'var(--text-muted)' }}>Sort by:</span> 
                    {SORT_LABELS[todo.sortMethod]} 
                    {TODO_CHEVRON_DOWN_ICON}
                </button>
                <button 
                    className="todo-sort-btn icon-only"
                    onClick={() => todo.setSortDirection(todo.sortDirection === 'asc' ? 'desc' : 'asc')}
                    title="Toggle Direction"
                >
                    {todo.sortDirection === 'asc' ? TODO_ARROW_UP_ICON : TODO_ARROW_DOWN_ICON}
                </button>
                
                <button className="todo-new-btn" onClick={onCreateNew}>
                    {TODO_PLUS_ICON} New Task
                </button>

                {sortMenuPos && (
                    <ContextMenu 
                        x={sortMenuPos.x} 
                        y={sortMenuPos.y} 
                        actions={getToolbarSortActions(todo.setSortMethod)}
                        onClose={() => setSortMenuPos(null)}
                    />
                )}
            </div>
        </div>
    );
};
