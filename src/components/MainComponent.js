import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddTaskForm from './AddTaskForm';
import Filter from './Filter';
import Sort from './Sort';
import TodoList from './TodoList';

const MainComponent = () => {
  const [todos, setTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await axios.get('/todos');
        setTodos(res.data);
        setFilteredTodos(res.data);
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    };
    fetchTodos();
  }, []);

  const addTodo = async (task) => {
    try {
      const res = await axios.post('/todos', { text: task });
      setTodos([...todos, res.data]);
      setFilteredTodos([...todos, res.data]);
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const editTodo = async (id, task) => {
    try {
      const res = await axios.put(`/editTodo/${id}`, { task });
      setTodos(todos.map(todo => (todo._id === id ? res.data : todo)));
      setFilteredTodos(todos.map(todo => (todo._id === id ? res.data : todo)));
    } catch (error) {
      console.error('Error editing todo:', error);
    }
  };

  const completeTodo = async (id) => {
    try {
      const res = await axios.put(`/completeTodo/${id}`);
      setTodos(todos.map(todo => (todo._id === id ? res.data : todo)));
      setFilteredTodos(todos.map(todo => (todo._id === id ? res.data : todo)));
    } catch (error) {
      console.error('Error completing todo:', error);
    }
  };

  return (
    <div>
      <AddTaskForm addTodo={addTodo} />
      <Filter todos={todos} setFilteredTodos={setFilteredTodos} />
      <Sort
        sortType={sortType}
        setSortType={setSortType}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        todos={todos}
        setFilteredTodos={setFilteredTodos}
        searchText={searchText}
        filterTodos={filterTodos}
        sortTodos={sortTodos}
      />
      <TodoList todos={filteredTodos} onEdit={editTodo} onComplete={completeTodo} />
    </div>
  );
};

export default MainComponent;
