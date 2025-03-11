import React, { useEffect, useReducer, useRef } from 'react';
import axios from 'axios';

const initialState = {
  todos: [],
  newTodoText: '',
  editTodo: null,
  editText: ''
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_TODOS':
      return { ...state, todos: action.payload };
    case 'SET_NEW_TODO_TEXT':
      return { ...state, newTodoText: action.payload };
    case 'SET_EDIT_TODO':
      return { ...state, editTodo: action.payload, editText: action.payload.text };
    case 'SET_EDIT_TEXT':
      return { ...state, editText: action.payload };
    case 'ADD_TODO':
      return { ...state, todos: [...state.todos, action.payload], newTodoText: '' };
    case 'UPDATE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo => (todo._id === action.payload._id ? action.payload : todo)),
        editTodo: null,
        editText: ''
      };
    case 'DELETE_TODO':
      return { ...state, todos: state.todos.filter(todo => todo._id !== action.payload) };
    default:
      return state;
  }
};

const TodoList = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { todos, newTodoText, editTodo, editText } = state;
  const editInputRef = useRef(null);
  const addInputRef = useRef(null);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        console.log('Fetching todos...');
        const response = await axios.get('http://localhost:5001/todos');
        dispatch({ type: 'SET_TODOS', payload: response.data });
        console.log('Fetched todos:', response.data);
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
        console.log('Adding new todo:', newTodoText);
        const response = await axios.post('http://localhost:5001/todos', { text: newTodoText });
        dispatch({ type: 'ADD_TODO', payload: response.data });
        console.log('Added new todo:', response.data);
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
      console.log('Toggling completion for todo:', id);
      const response = await axios.put(`http://localhost:5001/todos/${id}`, { completed: !completed });
      dispatch({ type: 'UPDATE_TODO', payload: response.data });
      console.log('Toggled completion for todo:', response.data);
    } catch (error) {
      console.error('Error toggling completion:', error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      console.log('Deleting todo:', id);
      await axios.delete(`http://localhost:5001/todos/${id}`);
      dispatch({ type: 'DELETE_TODO', payload: id });
      console.log('Deleted todo:', id);
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const startEditing = (todo) => {
    console.log('Starting to edit todo:', todo);
    dispatch({ type: 'SET_EDIT_TODO', payload: todo });
  };

  const saveEdit = async (id) => {
    console.log('Attempting to save edit for todo:', id, editText);
    if (editText !== editTodo.text) {
      try {
        console.log('Saving edit for todo:', id, editText);
        const response = await axios.put(`http://localhost:5001/todos/${id}`, { text: editText });
        dispatch({ type: 'UPDATE_TODO', payload: response.data });
        console.log('Saved edit for todo:', response.data);
      } catch (error) {
        console.error('Error saving edit:', error);
      }
    } else {
      console.log('No changes detected, cancelling edit.');
      dispatch({ type: 'SET_EDIT_TODO', payload: null });
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
        onChange={(e) => dispatch({ type: 'SET_NEW_TODO_TEXT', payload: e.target.value })}
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
                onChange={(e) => dispatch({ type: 'SET_EDIT_TEXT', payload: e.target.value })}
              />
            ) : (
              <span onClick={() => startEditing(todo)}>
                {todo.text} - {todo.completed ? 'Completed' : 'Incomplete'}
              </span>
            )}
            {editTodo && editTodo._id === todo._id ? (
              <button onClick={() => saveEdit(todo._id)}>Save</button>
            ) : (
              <button onClick={() => toggleCompletion(todo._id, todo.completed)}>
                {todo.completed ? 'Mark Incomplete' : 'Mark Complete'}
              </button>
            )}
            <button onClick={() => deleteTodo(todo._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
