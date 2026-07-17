import { useState, useEffect } from 'react';
import type { TodoItem, TodoPriority } from '../../../../../types/todo';

export const useTodoDialog = (
    initialData?: TodoItem | null, 
    onSave?: (data: Omit<TodoItem, 'id' | 'createdAt' | 'updatedAt'>) => void, 
    isOpen?: boolean
) => {
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

    const handleSave = () => {
        if (!title.trim() || !onSave) return;

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

    return {
        title, setTitle,
        description, setDescription,
        priority, setPriority,
        category, setCategory,
        dueDateStr, setDueDateStr,
        handleSave
    };
};
