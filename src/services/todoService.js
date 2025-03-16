import axios from 'axios';

const localHost = 'http://localhost:5001/api'; // Update the base URL to include /api

export const fetchTodos = async () => {
    try {
        return await axios.get(`${localHost}/todos`);
    } catch (error) {
        console.error('Error fetching todos:', error);
        throw error;
    }
};

export const addTodo = async (newTodoText) => {
    try {
        return await axios.post(`${localHost}/todos`, { text: newTodoText });
    } catch (error) {
        console.error('Error adding todo:', error);
        throw error;
    }
};

export const toggleCompletion = async (id, completed) => {
    try {
        return await axios.patch(`${localHost}/todos/${id}`, { completed: !completed });
    } catch (error) {
        console.error('Error toggling completion:', error);
        throw error;
    }
};

export const deleteTodo = async (id) => {
    try {
        return await axios.delete(`${localHost}/todos/${id}`);
    } catch (error) {
        console.error('Error deleting todo:', error);
        throw error;
    }
};

export const saveEdit = async (id, editText, completed) => {
    try {
        return await axios.put(`${localHost}/todos/${id}`, { text: editText, completed });
    } catch (error) {
        console.error('Error saving edit:', error);
        throw error;
    }
};
