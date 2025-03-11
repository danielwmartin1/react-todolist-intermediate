import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodoText, setNewTodoText] = useState('');
  const [editTodo, setEditTodo] = useState(null);
  const [editText, setEditText] = useState('');
  const editInputRef = useRef(null);
  const addInputRef = useRef(null);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get('http://localhost:5001/todos');
        setTodos(response.data);
        if (addInputRef.current) {
          addInputRef.current.focus();
        }
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    };

    fetchTodos();
  }, []);

  useEffect(() => {
    if (editTodo && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editTodo]);

  const addTodo = async () => {
    if (newTodoText.trim()) {
      try {
        const response = await axios.post('http://localhost:5001/todos', { text: newTodoText });
        setTodos([...todos, response.data]);
        setNewTodoText('');
        if (addInputRef.current) {
          addInputRef.current.focus();
        }
      } catch (error) {
        console.error('Error adding todo:', error);
      }
    }
  };

  const toggleCompletion = async (id, completed) => {
    try {
      const response = await axios.put(`http://localhost:5001/todos/${id}`, { completed: !completed });
      setTodos(todos.map(todo => (todo._id === id ? response.data : todo)));
    } catch (error) {
      console.error('Error toggling completion:', error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/todos/${id}`);
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const startEditing = (todo) => {
    setEditTodo(todo);
    setEditText(todo.text);
  };

  const saveEdit = async (id) => {
    if (editText !== editTodo.text) {
      try {
        const response = await axios.put(`http://localhost:5001/todos/${id}`, { text: editText });
        setTodos(todos.map(todo => (todo._id === id ? response.data : todo)));
        setEditTodo(null);
        setEditText('');
      } catch (error) {
        console.error('Error saving edit:', error);
      }
    } else {
      setEditTodo(null);
      setEditText('');
    }
  };

  const handleKeyDown = async (e, id) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent default form submission
      await saveEdit(id);
    }
  };

  const handleAddKeyDown = async (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent default form submission
      await addTodo();
    }
  };

  return (
    <div>
      <h1>Todo List</h1>
      <input
        ref={addInputRef}
        type="text"
        value={newTodoText}
        onChange={(e) => setNewTodoText(e.target.value)}
        placeholder="Add a new task"
        onKeyDown={handleAddKeyDown}
      />
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.map(todo => (
          <li key={todo._id}>
            {editTodo && editTodo._id === todo._id ? (
              <input
                ref={editInputRef}
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onBlur={() => saveEdit(todo._id)}
                onKeyDown={(e) => handleKeyDown(e, todo._id)}
              />
            ) : (
              <span onClick={() => startEditing(todo)}>
                {todo.text} - {todo.completed ? 'Completed' : 'Incomplete'}
              </span>
            )}
            <button onClick={() => toggleCompletion(todo._id, todo.completed)}>
              {todo.completed ? 'Mark Incomplete' : 'Mark Complete'}
            </button>
            <button onClick={() => deleteTodo(todo._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
