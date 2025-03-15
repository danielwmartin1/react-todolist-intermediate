import React, { useState, useEffect } from 'react';
import TodoList from './components/TodoList';
import axios from 'axios';

const App = () => {
    const [todos, setTodos] = useState([]);
    const [error, setError] = useState(null); // Add error state

    useEffect(() => {
        // Fetch todos from the backend
        axios.get('/api/todos')
            .then(response => setTodos(response.data))
            .catch(error => {
                console.error('Error fetching todos:', error);
                setError('Error fetching todos'); // Set error message
            });
    }, []);

    const handleDelete = async (id) => {
        console.log(`Sending delete request for todo with id: ${id}`);
        try {
            await axios.delete(`/api/todos/${id}`);
            setTodos(todos.filter(todo => todo._id !== id));
            console.log(`Todo with id: ${id} deleted successfully`);
        } catch (error) {
            console.error('Error deleting todo:', error);
            setError('Error deleting todo'); // Set error message
        }
    };

    const handleUpdate = async (id, updatedFields) => {
        try {
            const response = await axios.put(`/api/todos/${id}`, updatedFields);
            setTodos(todos.map(todo => (todo._id === id ? response.data : todo)));
        } catch (error) {
            console.error('Error updating todo:', error);
            setError('Error updating todo'); // Set error message
        }
    };

    if (error) return <div>{error}</div>; // Display error message

    return (
        <div>
            <h1>Todo List</h1>
            <TodoList todos={todos} onDelete={handleDelete} onUpdate={handleUpdate} />
        </div>
    );
};

export default App;
