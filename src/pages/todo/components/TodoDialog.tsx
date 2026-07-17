import React, { useState, useEffect } from 'react';
import type { TodoItem, TodoPriority } from '../../../types/todo';

interface TodoDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Omit<TodoItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
    initialData?: TodoItem | null;
}

export const TodoDialog: React.FC<TodoDialogProps> = ({ isOpen, onClose, onSave, initialData }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<TodoPriority>('Medium');
    const [category, setCategory] = useState('');
    const [dueDateStr, setDueDateStr] = useState('');

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
            setDescription(initialData.description || '');
            setPriority(initialData.priority);
            setCategory(initialData.category || '');
            if (initialData.dueDate) {
                const d = new Date(initialData.dueDate);
                // Format for input type="date": YYYY-MM-DD
                const yyyy = d.getFullYear();
                const mm = String(d.getMonth() + 1).padStart(2, '0');
                const dd = String(d.getDate()).padStart(2, '0');
                setDueDateStr(`${yyyy}-${mm}-${dd}`);
            } else {
                setDueDateStr('');
            }
        } else {
            setTitle('');
            setDescription('');
            setPriority('Medium');
            setCategory('');
            setDueDateStr('');
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSave = () => {
        if (!title.trim()) return;

        let dueDate: number | undefined = undefined;
        if (dueDateStr) {
            const d = new Date(dueDateStr);
            d.setHours(23, 59, 59, 999);
            dueDate = d.getTime();
        }

        onSave({
            title: title.trim(),
            description: description.trim() || undefined,
            priority,
            category: category.trim() || 'General',
            dueDate,
            completed: initialData ? initialData.completed : false,
            pinned: initialData ? initialData.pinned : false,
        });
    };

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
