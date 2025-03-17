import React, { useState, useEffect, useMemo } from 'react';
import { fetchTodos } from '../services/todoService';
import TodoListItems from './TodoListItems';

const TodoListContainer = () => {
    const [todos, setTodos] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [sortType, setSortType] = useState('created');
    const [sortOrder, setSortOrder] = useState('asc');

    useEffect(() => {
        const getTodos = async () => {
            try {
                const response = await fetchTodos();
                if (Array.isArray(response.data)) {
                    setTodos(response.data);
                } else {
                    console.error('API response is not an array:', response.data);
                }
            } catch (error) {
                console.error('Error fetching todos:', error);
            }
        };

        getTodos();
    }, []);

    const filteredTodos = useMemo(() => {
        if (!Array.isArray(todos)) {
            console.error('Todos is not an array:', todos);
            return [];
        }
        return todos.filter(todo => todo.text.toLowerCase().includes(searchText.toLowerCase()));
    }, [todos, searchText]);

    const sortedTodos = useMemo(() => {
        return filteredTodos.sort((a, b) => {
            if (sortType === 'created') {
                return sortOrder === 'asc' ? new Date(a.created) - new Date(b.created) : new Date(b.created) - new Date(a.created);
            } else if (sortType === 'updated') {
                return sortOrder === 'asc' ? new Date(a.updatedAt) - new Date(b.updatedAt) : new Date(b.updatedAt) - new Date(a.updatedAt);
            }
            // Add other sort types if needed
            return 0;
        });
    }, [filteredTodos, sortType, sortOrder]);

    return (
        <div>
            <h2>Todo List</h2>
            <div>
                <label>
                    Sort Order:
                    <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                </label>
            </div>
            <TodoListItems todos={sortedTodos} />
        </div>
    );
};

export default TodoListContainer;
