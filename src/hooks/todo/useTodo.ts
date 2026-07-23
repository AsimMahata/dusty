import { useState, useEffect, useMemo } from 'react';
import { useCommon } from '../useCommon';
import type { TodoItem, SortMethod, SortDirection } from '../../types/todo';
import { fetchTodos, createTodo, updateTodo, deleteTodo } from '../../utility/todoStorage';
import { PRIORITY_LEVELS } from '../../constants/todo';
import { getSortMethodTodoPage, getDefaultSortMethod, setSortMethodTodoPage, getSortDirectionTodoPage, getDefaultSortDirection, setSortDirectionTodoPage } from '../../session/todo/sort';

export const useTodo = () => {
    const common = useCommon();
    const [todos, setTodos] = useState<TodoItem[]>([]);
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [sortMethod, setSortMethodState] = useState<SortMethod>(getDefaultSortMethod());
    const [sortDirection, setSortDirectionState] = useState<SortDirection>(getDefaultSortDirection());

    async function fetchSessionData() {
        try {
            const method = await getSortMethodTodoPage();
            setSortMethodState(method);
        } catch (e) {}
        try {
            const direction = await getSortDirectionTodoPage();
            setSortDirectionState(direction);
        } catch (e) {}
    }

    const setSortMethod = (method: SortMethod) => {
        setSortMethodState(method);
        void setSortMethodTodoPage(method);
    };

    const setSortDirection = (direction: SortDirection) => {
        setSortDirectionState(direction);
        void setSortDirectionTodoPage(direction);
    };

    const loadTodos = async () => {
        common.setIsLoading(true);
        try {
            const data = await fetchTodos();
            setTodos(data);
        } catch (e) {
            console.error("Failed to load todos", e);
        } finally {
            common.setIsLoading(false);
        }
    };

    const handleRefresh = async () => {
        common.setIsRefreshing(true);
        await loadTodos();
        common.setIsRefreshing(false);
    };

    useEffect(() => {
        fetchSessionData();
        loadTodos();
    }, []);

    const addTodo = async (todo: Omit<TodoItem, 'id' | 'createdAt' | 'updatedAt'>) => {
        const newTodo = await createTodo(todo);
        setTodos(prev => [...prev, newTodo]);
    };

    const editTodo = async (id: string, updates: Partial<Omit<TodoItem, 'id' | 'createdAt'>>) => {
        const updated = await updateTodo(id, updates);
        if (updated) {
            setTodos(prev => prev.map(t => t.id === id ? updated : t));
        }
    };

    const removeTodo = async (id: string) => {
        await deleteTodo(id);
        setTodos(prev => prev.filter(t => t.id !== id));
    };

    const toggleComplete = async (id: string, current: boolean) => {
        await editTodo(id, { completed: !current });
    };

    const togglePin = async (id: string, current: boolean) => {
        await editTodo(id, { pinned: !current });
    };

    const duplicateTodo = async (todo: TodoItem) => {
        const { id, createdAt, updatedAt, ...rest } = todo;
        await addTodo({ ...rest, title: `${rest.title} (Copy)` });
    };

    const filteredAndSortedTodos = useMemo(() => {
        let result = [...todos];

        // 1. Category Filter
        if (activeCategory === 'completed') {
            result = result.filter(t => t.completed);
        } else if (activeCategory === 'pinned') {
            result = result.filter(t => t.pinned);
        } else if (activeCategory === 'today') {
            const today = new Date();
            today.setHours(0,0,0,0);
            result = result.filter(t => {
                if (!t.dueDate) return false;
                const due = new Date(t.dueDate);
                due.setHours(0,0,0,0);
                return due.getTime() === today.getTime();
            });
        } else if (activeCategory === 'upcoming') {
            const today = new Date();
            today.setHours(0,0,0,0);
            result = result.filter(t => {
                if (!t.dueDate) return false;
                const due = new Date(t.dueDate);
                due.setHours(0,0,0,0);
                return due.getTime() > today.getTime();
            });
        } else if (activeCategory !== 'all') {
            // custom category
            result = result.filter(t => t.category === activeCategory);
        }

        // 2. Search Filter
        if (common.searchQuery) {
            const q = common.searchQuery.toLowerCase();
            result = result.filter(t => 
                t.title.toLowerCase().includes(q) || 
                (t.description && t.description.toLowerCase().includes(q)) ||
                (t.category && t.category.toLowerCase().includes(q))
            );
        }

        // 3. Sorting
        result.sort((a, b) => {
            if (sortMethod === 'pinned') {
                if (a.pinned && !b.pinned) return sortDirection === 'asc' ? -1 : 1;
                if (!a.pinned && b.pinned) return sortDirection === 'asc' ? 1 : -1;
            }

            let cmp = 0;
            if (sortMethod === 'created') cmp = a.createdAt - b.createdAt;
            else if (sortMethod === 'updated') cmp = a.updatedAt - b.updatedAt;
            else if (sortMethod === 'alpha') cmp = a.title.localeCompare(b.title);
            else if (sortMethod === 'priority') {
                cmp = (PRIORITY_LEVELS[a.priority] || 0) - (PRIORITY_LEVELS[b.priority] || 0);
            }
            else if (sortMethod === 'due') {
                const aDue = a.dueDate || Number.MAX_SAFE_INTEGER;
                const bDue = b.dueDate || Number.MAX_SAFE_INTEGER;
                cmp = aDue - bDue;
            }

            return sortDirection === 'asc' ? cmp : -cmp;
        });

        // Ensure pinned is always on top if sort method is not explicitly 'pinned' (Optional UX choice)
        // But the prompt says "Support: ... Pinned First" as a sort method. We'll stick to strict sort logic.
        
        return result;
    }, [todos, activeCategory, common.searchQuery, sortMethod, sortDirection]);

    return {
        ...common,
        title: "TODO",
        fetchData: handleRefresh,
        todos,
        filteredTodos: filteredAndSortedTodos,
        activeCategory, setActiveCategory,
        sortMethod, setSortMethod,
        sortDirection, setSortDirection,
        addTodo,
        editTodo,
        removeTodo,
        toggleComplete,
        togglePin,
        duplicateTodo
    };
};
