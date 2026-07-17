import React from 'react';
import { PageLayout } from '../../components/layout/PageLayout';
import { TodoSidebar } from './components/sidebar/TodoSidebar';
import { TodoList } from './components/list/TodoList';
import { TodoToolbar } from './components/toolbar/TodoToolbar';
import { TodoDialog } from './components/dialogs/TodoDialog';
import { useTodoPage } from './hooks/useTodoPage';
import './css/Todo.css';

export const TodoPage: React.FC = () => {
    const {
        todo,
        isDialogOpen,
        editingTodo,
        handleCreateNew,
        handleEdit,
        handleSaveDialog,
        handleCloseDialog
    } = useTodoPage();

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
                    onClose={handleCloseDialog} 
                    onSave={handleSaveDialog}
                    initialData={editingTodo} 
                />
            )}
        </PageLayout>
    );
};
