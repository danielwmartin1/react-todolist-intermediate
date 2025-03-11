import React, { useEffect, useReducer, useRef } from 'react';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';

const initialState = {
  todos: [],
  newTodoText: '',
  editId: null,
  editText: ''
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_TODOS':
      return { ...state, todos: action.payload };
    case 'SET_NEW_TODO_TEXT':
      return { ...state, newTodoText: action.payload };
    case 'ADD_TODO':
      return { ...state, todos: [...state.todos, action.payload], newTodoText: '' };
    case 'SET_EDIT_TODO':
      return { ...state, editId: action.payload.id, editText: action.payload.text };
    case 'SET_EDIT_TEXT':
      return { ...state, editText: action.payload };
    case 'UPDATE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo => (todo._id === action.payload._id ? action.payload : todo)),
        editId: null,
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
  const { todos, newTodoText, editId, editText } = state;
  const addInputRef = useRef(null);
  const editInputRef = useRef(null);

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
  }, []); // Ensure this useEffect runs only once on mount

  useEffect(() => {
    if (editId && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editId]);

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
    dispatch({ type: 'SET_EDIT_TODO', payload: { id: todo._id, text: todo.text } });
  };

  const saveEdit = async (id) => {
    if (editText.trim()) {
      try {
        const todo = todos.find(todo => todo._id === id);
        const updatedTodo = { text: editText, completed: todo.completed };
        console.log('Saving edit for todo:', id, updatedTodo);
        const response = await axios.put(`http://localhost:5001/todos/${id}`, updatedTodo);
        dispatch({ type: 'UPDATE_TODO', payload: response.data });
        console.log('Saved edit for todo:', response.data);
      } catch (error) {
        console.error('Error saving edit:', error);
      }
    }
  };

  const handleAddKeyDown = async (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent default form submission
      await addTodo();
    }
  };

  const handleEditKeyDown = async (e, id) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent default form submission
      await saveEdit(id);
    }
  };

  return (
    <div style={styles.container}>
      <Header />
      <div style={styles.content}>
        <input
          ref={addInputRef}
          type="text"
          value={newTodoText}
          onChange={(e) => dispatch({ type: 'SET_NEW_TODO_TEXT', payload: e.target.value })}
          placeholder="Add a new task"
          onKeyDown={handleAddKeyDown}
          style={styles.input}
        />
        <button onClick={addTodo} style={styles.button}>Add</button>
        <ul style={styles.list}>
          {todos.map(todo => (
            <li key={todo._id} style={styles.listItem}>
              {editId === todo._id ? (
                <input
                  ref={editInputRef}
                  type="text"
                  value={editText}
                  onChange={(e) => dispatch({ type: 'SET_EDIT_TEXT', payload: e.target.value })}
                  onKeyDown={(e) => handleEditKeyDown(e, todo._id)}
                  style={styles.input}
                />
              ) : (
                <span onClick={() => startEditing(todo)} style={styles.todoText}>
                  {todo.text} - {todo.completed ? 'Completed' : 'Incomplete'}
                </span>
              )}
              {editId === todo._id ? (
                <button onClick={() => saveEdit(todo._id)} style={styles.button}>Save</button>
              ) : (
                <button onClick={() => toggleCompletion(todo._id, todo.completed)} style={styles.button}>
                  {todo.completed ? 'Mark Incomplete' : 'Mark Complete'}
                </button>
              )}
              <button onClick={() => deleteTodo(todo._id)} style={styles.button}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
      <Footer />
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh'
  },
  content: {
    flex: '1',
    padding: '20px',
    textAlign: 'center'
  },
  input: {
    padding: '10px',
    margin: '10px',
    width: '80%'
  },
  button: {
    padding: '10px',
    margin: '10px'
  },
  list: {
    listStyleType: 'none',
    padding: '0'
  },
  listItem: {
    margin: '10px 0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  todoText: {
    flex: '1',
    cursor: 'pointer'
  }
};

export default TodoList;
