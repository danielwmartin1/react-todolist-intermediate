import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TodoList from './components/TodoList';

const App = () => {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await axios.get('/todos');
        setTodos(res.data); // Fetch and set todos from the backend
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    };
    fetchTodos();
  }, []);

  const editTodo = async (id, task) => {
    try {
      const res = await axios.put(`/editTodo/${id}`, { task });
      setTodos(todos.map(todo => (todo._id === id ? res.data : todo))); // Update the edited todo
    } catch (error) {
      console.error('Error editing todo:', error);
    }
  };

  const completeTodo = async (id) => {
    try {
      const res = await axios.put(`/completeTodo/${id}`);
      setTodos(todos.map(todo => (todo._id === id ? res.data : todo))); // Mark the todo as completed
    } catch (error) {
      console.error('Error completing todo:', error);
    }
  };

  return (
    <div>
      <Filter />
      <TodoList todos={todos} onEdit={editTodo} onComplete={completeTodo} />
    </div>
  );
};

export default App;
