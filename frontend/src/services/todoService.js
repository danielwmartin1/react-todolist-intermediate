import axios from 'axios';

const backendUrl = 'https://dwm-intermediate-react-todolist-api.vercel.app/api/todos'; // Ensure the base URL is correct

export const fetchTodos = async () => {
  try {
    return await axios.get(`${backendUrl}`);
  } catch (error) {
    console.error('Error fetching todos:', error);
    throw error;
  }
};

export const addTodo = async (newTodoText) => {
  try {
    return await axios.post(`${backendUrl}`, { text: newTodoText });
  } catch (error) {
    console.error('Error adding todo:', error);
    throw error;
  }
};

export const toggleCompletion = async (id, completed) => {
  try {
    return await axios.patch(`${backendUrl}/${id}`, { completed });
  } catch (error) {
    console.error('Error toggling completion:', error);
    throw error;
  }
};

export const deleteTodo = async (id) => {
  try {
    return await axios.delete(`${backendUrl}/${id}`);
  } catch (error) {
    console.error('Error deleting todo:', error);
    throw error;
  }
};

export const saveEdit = async (id, editText, completed) => {
  try {
    return await axios.put(`${backendUrl}/${id}`, { text: editText, completed });
  } catch (error) {
    console.error('Error saving edit:', error);
    throw error;
  }
};
