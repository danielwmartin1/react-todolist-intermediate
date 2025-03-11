import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TodoItem from './components/TodoItem';

const App = () => {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const fetchTodos = async () => {
      const res = await axios.get('/todos');
      setTodos(res.data);
    };
    fetchTodos();
  }, []);

  const editTodo = async (id, task) => {
    const res = await axios.put(`/editTodo/${id}`, { task });
    setTodos(todos.map(todo => (todo._id === id ? res.data : todo)));
  };

  const completeTodo = async (id) => {
    const res = await axios.put(`/completeTodo/${id}`);
    setTodos(todos.map(todo => (todo._id === id ? res.data : todo)));
  };

  return (
    <div>
      {/* ...existing code... */}
      {todos.map(todo => (
        <TodoItem
          key={todo._id}
          todo={todo}
          onEdit={editTodo}
          onComplete={completeTodo}
        />
      ))}
    </div>
  );
};

export default App;
