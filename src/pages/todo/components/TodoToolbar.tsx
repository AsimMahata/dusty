import React, { useState } from 'react';
import { Plus, ChevronDown, ArrowUp, ArrowDown } from 'lucide-react';
import { useTodo } from '../../../hooks/todo/useTodo';
import type { SortMethod } from '../../../types/todo';
import { ContextMenu } from '../../../components/ui/ContextMenu';

interface TodoToolbarProps {
    todo: ReturnType<typeof useTodo>;
    onCreateNew: () => void;
}

export const TodoToolbar: React.FC<TodoToolbarProps> = ({ todo, onCreateNew }) => {
    const [sortMenuPos, setSortMenuPos] = useState<{x: number, y: number} | null>(null);

    const getSortLabel = (method: SortMethod) => {
        switch(method) {
            case 'created': return 'Created Date';
            case 'updated': return 'Updated Date';
            case 'alpha': return 'Alphabetical';
            case 'priority': return 'Priority';
            case 'due': return 'Due Date';
            case 'pinned': return 'Pinned First';
        }
    };

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
                    {getSortLabel(todo.sortMethod)} 
                    <ChevronDown size={14} />
                </button>
                <button 
                    className="todo-sort-btn icon-only"
                    onClick={() => todo.setSortDirection(todo.sortDirection === 'asc' ? 'desc' : 'asc')}
                    title="Toggle Direction"
                >
                    {todo.sortDirection === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                </button>
                
                <button className="todo-new-btn" onClick={onCreateNew}>
                    <Plus size={16} /> New Task
                </button>

                {sortMenuPos && (
                    <ContextMenu 
                        x={sortMenuPos.x} 
                        y={sortMenuPos.y} 
                        actions={[
                            { label: 'Created Date', onClick: () => todo.setSortMethod('created') },
                            { label: 'Updated Date', onClick: () => todo.setSortMethod('updated') },
                            { label: 'Alphabetical', onClick: () => todo.setSortMethod('alpha') },
                            { label: 'Priority', onClick: () => todo.setSortMethod('priority') },
                            { label: 'Due Date', onClick: () => todo.setSortMethod('due') },
                            { label: 'Pinned First', onClick: () => todo.setSortMethod('pinned') },
                        ]}
                        onClose={() => setSortMenuPos(null)}
                    />
                )}
            </div>
        </div>
    );
};
