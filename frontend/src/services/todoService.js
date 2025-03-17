import axios from 'axios';

const backendUrl = 'http://localhost:5001/api'; // Ensure the base URL is correct

export const fetchTodos = async () => {
  try {
    return await axios.get(`${backendUrl}/todos`);
  } catch (error) {
    console.error('Error fetching todos:', error);
    throw error;
  }
};

export const addTodo = async (newTodoText) => {
  try {
    return await axios.post(`${backendUrl}/todos`, { text: newTodoText });
  } catch (error) {
    console.error('Error adding todo:', error);
    throw error;
  }
};

export const toggleCompletion = async (id, completed) => {
  try {
    return await axios.patch(`${backendUrl}/todos/${id}`, { completed });
  } catch (error) {
    console.error('Error toggling completion:', error);
    throw error;
  }
};

export const deleteTodo = async (id) => {
  try {
    return await axios.delete(`${backendUrl}/todos/${id}`);
  } catch (error) {
    console.error('Error deleting todo:', error);
    throw error;
  }
};

export const saveEdit = async (id, editText, completed) => {
  try {
    return await axios.put(`${backendUrl}/todos/${id}`, { text: editText, completed });
  } catch (error) {
    console.error('Error saving edit:', error);
    throw error;
  }
};
