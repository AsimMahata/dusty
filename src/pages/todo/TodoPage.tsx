import React, { useState } from 'react';
import { PageLayout } from '../../components/layout/PageLayout';
import { useTodo } from '../../hooks/todo/useTodo';
import { TodoSidebar } from './components/TodoSidebar';
import { TodoList } from './components/TodoList';
import { TodoToolbar } from './components/TodoToolbar';
import { TodoDialog } from './components/TodoDialog';
import type { TodoItem } from '../../types/todo';
import './Todo.css';

export const TodoPage: React.FC = () => {
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

    return (
        <PageLayout hook={todo} showCloseButton>
            <div className="todo-page-container">
                <TodoSidebar 
                    activeCategory={todo.activeCategory} 
                    setActiveCategory={todo.setActiveCategory} 
                    todos={todo.todos} 
                />
                
                <div className="todo-main-content">
                    <TodoToolbar 
                        todo={todo}
                        onCreateNew={handleCreateNew} 
                    />
                    
                    <TodoList 
                        todos={todo.filteredTodos} 
                        onEdit={handleEdit}
                        onToggleComplete={todo.toggleComplete}
                        onTogglePin={todo.togglePin}
                        onDuplicate={todo.duplicateTodo}
                        onDelete={todo.removeTodo}
                    />
                </div>
            </div>

            {isDialogOpen && (
                <TodoDialog 
                    isOpen={isDialogOpen} 
                    onClose={() => setIsDialogOpen(false)} 
                    onSave={async (data) => {
                        if (editingTodo) {
                            await todo.editTodo(editingTodo.id, data);
                        } else {
                            await todo.addTodo(data);
                        }
                        setIsDialogOpen(false);
                    }}
                    initialData={editingTodo} 
                />
            )}
        </PageLayout>
    );
};
