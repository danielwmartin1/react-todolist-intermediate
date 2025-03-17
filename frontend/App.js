import React, { useReducer, useEffect } from 'react';
import { fetchTodos, addTodo, toggleCompletion, deleteTodo, saveEdit } from './services/todoService';
import TodoList from './components/TodoList';
import TodoForm from './components/TodoForm';

// Define initial state
const initialState = {
    todos: [],
    loading: true,
    searchText: '',
    sortType: 'created',
    sortOrder: 'asc'
};

// Define reducer function
function reducer(state, action) {
    switch (action.type) {
        case 'SET_TODOS':
            return { ...state, todos: action.payload, loading: false };
        case 'ADD_TODO':
            return { ...state, todos: [...state.todos, action.payload] };
        case 'TOGGLE_COMPLETION':
            return {
                ...state,
                todos: state.todos.map(todo =>
                    todo._id === action.payload.id ? { ...todo, completed: !todo.completed, completedAt: action.payload.completed ? new Date() : null } : todo
                )
            };
        case 'DELETE_TODO':
            return { ...state, todos: state.todos.filter(todo => todo._id !== action.payload) };
        case 'SAVE_EDIT':
            return {
                ...state,
                todos: state.todos.map(todo =>
                    todo._id === action.payload.id ? { ...todo, text: action.payload.text, completed: action.payload.completed, completedAt: action.payload.completed ? new Date() : null } : todo
                )
            };
        case 'SET_SEARCH_TEXT':
            return { ...state, searchText: action.payload };
        case 'SET_SORT_TYPE':
            return { ...state, sortType: action.payload };
        case 'SET_SORT_ORDER':
            return { ...state, sortOrder: action.payload };
        default:
            return state;
    }
}

const App = () => {
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        const getTodos = async () => {
            try {
                const response = await fetchTodos();
                dispatch({ type: 'SET_TODOS', payload: response.data });
            } catch (error) {
                console.error('Error fetching todos:', error);
            }
        };

        getTodos();
    }, []);

    const handleAddTodo = async (newTodoText) => {
        try {
            const response = await addTodo(newTodoText);
            dispatch({ type: 'ADD_TODO', payload: response.data });
        } catch (error) {
            console.error('Error adding todo:', error);
        }
    };

    const handleToggleCompletion = async (id, completed) => {
        try {
            await toggleCompletion(id, completed);
            dispatch({ type: 'TOGGLE_COMPLETION', payload: { id, completed } });
        } catch (error) {
            console.error('Error toggling completion:', error);
        }
    };

    const handleDeleteTodo = async (id) => {
        try {
            await deleteTodo(id);
            dispatch({ type: 'DELETE_TODO', payload: id });
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    };

    const handleSaveEdit = async (id, editText, completed) => {
        try {
            await saveEdit(id, editText, completed);
            dispatch({ type: 'SAVE_EDIT', payload: { id, text: editText, completed } });
        } catch (error) {
            console.error('Error saving edit:', error);
        }
    };

    const handleSearchTextChange = (e) => {
        dispatch({ type: 'SET_SEARCH_TEXT', payload: e.target.value });
    };

    const handleSortTypeChange = (e) => {
        dispatch({ type: 'SET_SORT_TYPE', payload: e.target.value });
    };

    const handleSortOrderChange = (e) => {
        dispatch({ type: 'SET_SORT_ORDER', payload: e.target.value });
    };

    const filteredTodos = state.todos.filter(todo =>
        todo.text.toLowerCase().includes(state.searchText.toLowerCase())
    );

    const sortedTodos = filteredTodos.sort((a, b) => {
        if (state.sortType === 'created') {
            return state.sortOrder === 'asc' ? new Date(a.createdAt) - new Date(b.createdAt) : new Date(b.createdAt) - new Date(a.createdAt);
        } else if (state.sortType === 'updated') {
            return state.sortOrder === 'asc' ? new Date(a.updatedAt) - new Date(b.updatedAt) : new Date(b.updatedAt) - new Date(a.updatedAt);
        } else if (state.sortType === 'completed') {
            return state.sortOrder === 'asc' ? new Date(a.completedAt) - new Date(b.completedAt) : new Date(b.completedAt) - new Date(a.completedAt);
        }
        return 0;
    });

    if (state.loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="App">
            <h1>Todo List</h1>
            <TodoForm onAddTodo={handleAddTodo} />
            <div>
                <input
                    type="text"
                    placeholder="Search todos..."
                    value={state.searchText}
                    onChange={handleSearchTextChange}
                />
                <label>
                    Sort Type:
                    <select value={state.sortType} onChange={handleSortTypeChange}>
                        <option value="created">Created</option>
                        <option value="updated">Updated</option>
                        <option value="completed">Completed</option>
                    </select>
                </label>
                <label>
                    Sort Order:
                    <select value={state.sortOrder} onChange={handleSortOrderChange}>
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                </label>
            </div>
            <TodoList
                todos={sortedTodos}
                onToggleCompletion={handleToggleCompletion}
                onDeleteTodo={handleDeleteTodo}
                onSaveEdit={handleSaveEdit}
            />
        </div>
    );
};

export default App;