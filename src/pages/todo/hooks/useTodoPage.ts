import { useState } from 'react';
import type { TodoItem } from '../../../types/todo';
import { useTodo } from '../../../hooks/todo/useTodo';

export const useTodoPage = () => {
    const todo = useTodo();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingTodo, setEditingTodo] = useState<TodoItem | null>(null);

    const handleCreateNew = () => {
        setEditingTodo(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (item: TodoItem) => {
        setEditingTodo(item);
        setIsDialogOpen(true);
    };

    const handleSaveDialog = async (data: Omit<TodoItem, 'id' | 'createdAt' | 'updatedAt'>) => {
        if (editingTodo) {
            await todo.editTodo(editingTodo.id, data);
        } else {
            await todo.addTodo(data);
        }
        setIsDialogOpen(false);
    };

    const handleCloseDialog = () => setIsDialogOpen(false);

    return {
        todo,
        isDialogOpen,
        editingTodo,
        handleCreateNew,
        handleEdit,
        handleSaveDialog,
        handleCloseDialog
    };
};
