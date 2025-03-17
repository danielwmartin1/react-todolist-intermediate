import React, { useState, useEffect } from 'react';
import { fetchTodos, addTodo, toggleCompletion, deleteTodo, saveEdit } from './services/todoService';
import TodoList from './components/TodoList';
import TodoForm from './components/TodoForm';

const App = () => {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getTodos = async () => {
            try {
                const response = await fetchTodos();
                setTodos(response.data);
            } catch (error) {
                console.error('Error fetching todos:', error);
            } finally {
                setLoading(false);
            }
        };

        getTodos();
    }, []);

    const handleAddTodo = async (newTodoText) => {
        try {
            const response = await addTodo(newTodoText);
            setTodos([...todos, response.data]);
        } catch (error) {
            console.error('Error adding todo:', error);
        }
    };

    const handleToggleCompletion = async (id, completed) => {
        try {
            await toggleCompletion(id, completed);
            setTodos(todos.map(todo => todo._id === id ? { ...todo, completed: !completed } : todo));
        } catch (error) {
            console.error('Error toggling completion:', error);
        }
    };

    const handleDeleteTodo = async (id) => {
        try {
            await deleteTodo(id);
            setTodos(todos.filter(todo => todo._id !== id));
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    };

    const handleSaveEdit = async (id, editText, completed) => {
        try {
            await saveEdit(id, editText, completed);
            setTodos(todos.map(todo => todo._id === id ? { ...todo, text: editText, completed } : todo));
        } catch (error) {
            console.error('Error saving edit:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="App">
            <h1>Todo List</h1>
            <TodoForm onAddTodo={handleAddTodo} />
            <TodoList
                todos={todos}
                onToggleCompletion={handleToggleCompletion}
                onDeleteTodo={handleDeleteTodo}
                onSaveEdit={handleSaveEdit}
            />
        </div>
    );
};

export default App;