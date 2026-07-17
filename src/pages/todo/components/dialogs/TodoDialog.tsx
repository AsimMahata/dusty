import React from 'react';
import type { TodoItem, TodoPriority } from '../../../../types/todo';
import { useTodoDialog } from './hooks/useTodoDialog';

interface TodoDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Omit<TodoItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
    initialData?: TodoItem | null;
}

export const TodoDialog: React.FC<TodoDialogProps> = ({ isOpen, onClose, onSave, initialData }) => {
    const {
        title, setTitle,
        description, setDescription,
        priority, setPriority,
        category, setCategory,
        dueDateStr, setDueDateStr,
        handleSave
    } = useTodoDialog(initialData, onSave, isOpen);

    if (!isOpen) return null;

    return (
        <div className="todo-dialog-overlay" onClick={onClose}>
            <div className="todo-dialog" onClick={e => e.stopPropagation()}>
                <h3 className="todo-dialog-header">
                    {initialData ? 'Edit Task' : 'New Task'}
                </h3>
                
                <div className="todo-form-group">
                    <label>Title</label>
                    <input 
                        className="todo-input"
                        autoFocus
                        value={title} 
                        onChange={e => setTitle(e.target.value)} 
                        placeholder="What needs to be done?"
                    />
                </div>
                
                <div className="todo-form-group">
                    <label>Description (Optional)</label>
                    <textarea 
                        className="todo-textarea"
                        value={description} 
                        onChange={e => setDescription(e.target.value)} 
                        placeholder="Add more details..."
                    />
                </div>
                
                <div style={{ display: 'flex', gap: '16px' }}>
                    <div className="todo-form-group" style={{ flex: 1 }}>
                        <label>Priority</label>
                        <select 
                            className="todo-select"
                            value={priority} 
                            onChange={e => setPriority(e.target.value as TodoPriority)}
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </div>
                    <div className="todo-form-group" style={{ flex: 1 }}>
                        <label>Category</label>
                        <input 
                            className="todo-input"
                            value={category} 
                            onChange={e => setCategory(e.target.value)} 
                            placeholder="e.g. Work, Personal"
                        />
                    </div>
                </div>

                <div className="todo-form-group">
                    <label>Due Date (Optional)</label>
                    <input 
                        type="date"
                        className="todo-input"
                        value={dueDateStr} 
                        onChange={e => setDueDateStr(e.target.value)} 
                    />
                </div>
                
                <div className="todo-dialog-actions">
                    <button className="todo-btn-cancel" onClick={onClose}>Cancel</button>
                    <button className="todo-btn-save" onClick={handleSave} disabled={!title.trim()}>Save</button>
                </div>
            </div>
        </div>
    );
};
