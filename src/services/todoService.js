import axios from 'axios';

// Create an Axios instance for API calls
const apiClient = axios.create({
  baseURL: 'https://dwm-intermediate-react-todolist-api.vercel.app/api', // Base API URL
  timeout: 5000, // Set a timeout for requests
});

/**
 * Fetches the list of todos from the API.
 * @returns {Promise<Array>} List of todos
 */
export const fetchTodos = async () => {
  try {
    const response = await apiClient.get('/todos'); // Use the Axios instance
    return response.data; // Return the fetched data
  } catch (error) {
    console.error('Error fetching todos:', error.message);
    throw error; // Rethrow the error for further handling
  }
};
