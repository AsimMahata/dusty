import type { TodoItem } from '../types/todo';

const STORAGE_KEY = 'dusty_todos_v1';

// This file acts as a mock for backend IPC calls.
// Later, these functions can be replaced with Tauri invoke() calls.

export const fetchTodos = async (): Promise<TodoItem[]> => {
    return new Promise((resolve) => {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            resolve(data ? JSON.parse(data) : []);
        } catch {
            resolve([]);
        }
    });
};

export const saveTodos = async (todos: TodoItem[]): Promise<void> => {
    return new Promise((resolve) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
        resolve();
    });
};

export const createTodo = async (todo: Omit<TodoItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<TodoItem> => {
    const todos = await fetchTodos();
    const newTodo: TodoItem = {
        ...todo,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
    };
    await saveTodos([...todos, newTodo]);
    return newTodo;
};

export const updateTodo = async (id: string, updates: Partial<Omit<TodoItem, 'id' | 'createdAt'>>): Promise<TodoItem | null> => {
    const todos = await fetchTodos();
    let updatedTodo: TodoItem | null = null;
    
    const newTodos = todos.map(t => {
        if (t.id === id) {
            updatedTodo = { ...t, ...updates, updatedAt: Date.now() };
            return updatedTodo;
        }
        return t;
    });
    
    await saveTodos(newTodos);
    return updatedTodo;
};

export const deleteTodo = async (id: string): Promise<void> => {
    const todos = await fetchTodos();
    await saveTodos(todos.filter(t => t.id !== id));
};
