import React, { useEffect, useReducer, useRef, useState, useMemo } from 'react';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import './TodoListMediaQueries.css';
import { fetchTodos, addTodo, toggleCompletion, deleteTodo, saveEdit } from '../services/todoService.js';
import TodoListItems from './TodoListItems.jsx';
import { TodoProvider } from '../context/TodoContext.jsx';
import AddTaskForm from './AddTaskForm.jsx';

const initialState = {
  todos: [],
  newTodoText: '',
  editId: null,
  editText: '',
  createdAt: new Date(),
  updatedAt: new Date(),
  completedAt: null
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

const TodoListContainer = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { todos, newTodoText, editId, editText } = state;
  const [searchText, setSearchText] = useState('');
  const [sortType, setSortType] = useState('created');
  const [sortOrder, setSortOrder] = useState('desc'); // Add state for sort order
  const [isDatabaseConnecting, setIsDatabaseConnecting] = useState(true); // Add state for database connection
  const addInputRef = useRef(null);
  const editInputRef = useRef(null);

  useEffect(() => {
    const simulateDatabaseConnection = setTimeout(() => {
      setIsDatabaseConnecting(false);
    }, 2000); // Simulate a delay for database connection

    return () => clearTimeout(simulateDatabaseConnection);
  }, []);

  useEffect(() => {
    if (!isDatabaseConnecting) {
      const fetchTodosData = async () => {
        try {
          console.log('Fetching todos...'); // Debugging statement
          const response = await fetchTodos();
          dispatch({ type: 'SET_TODOS', payload: response.data });
          console.log('Fetched todos:', response.data); // Debugging statement
          if (addInputRef.current) {
            addInputRef.current.focus();
          }
        } catch (error) {
          console.error('Error fetching todos:', error);
        }
      };

      fetchTodosData();
    }
  }, [isDatabaseConnecting]); // Ensure this useEffect runs only once on mount

  useEffect(() => {
    if (editId && editInputRef.current) {
      console.log('Focusing on edit input for todo ID:', editId);
      editInputRef.current.focus();
    }
  }, [editId]);

  const addTodoHandler = async () => {
    if (newTodoText.trim()) {
      try {
        console.log('Adding new todo:', newTodoText);
        const response = await addTodo(newTodoText);
        const newTodo = response.data;
        const updatedTodos = [newTodo, ...todos];
        dispatch({ type: 'SET_TODOS', payload: updatedTodos });
        dispatch({ type: 'SET_NEW_TODO_TEXT', payload: '' });
        console.log('Added new todo:', newTodo);
        if (addInputRef.current) {
          addInputRef.current.focus();
        }
      } catch (error) {
        console.error('Error adding todo:', error);
      }
    }
  };

  const toggleCompletionHandler = async (id, completed) => {
    try {
      console.log('Toggling completion for todo ID:', id, 'to:', completed);
      const response = await toggleCompletion(id, completed);
      dispatch({ type: 'UPDATE_TODO', payload: response.data });
      console.log('Toggled completion for todo:', response.data);
    } catch (error) {
      console.error('Error toggling completion:', error);
    }
  };

  const deleteTodoHandler = async (id) => {
    try {
      console.log('Deleting todo ID:', id);
      await deleteTodo(id);
      dispatch({ type: 'DELETE_TODO', payload: id });
      console.log('Deleted todo ID:', id);
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const startEditing = (todo) => {
    console.log('Starting edit for todo:', todo);
    dispatch({ type: 'SET_EDIT_TODO', payload: { id: todo._id, text: todo.text } });
    dispatch({ type: 'SET_EDIT_TEXT', payload: todo.text });
  };

  const saveEditHandler = async (id) => {
    if (editText.trim() && editText.trim() !== newTodoText.trim()) {
      try {
        const todo = todos.find(todo => todo._id === id);
        if (editText.trim() === todo.text.trim()) {
          dispatch({ type: 'SET_EDIT_TODO', payload: { id: null, text: '' } });
          return;
        }
        const updatedTodo = { text: editText, completed: todo.completed };
        console.log('Saving edit for todo:', id, updatedTodo);
        const response = await saveEdit(id, editText, todo.completed);
        dispatch({ type: 'UPDATE_TODO', payload: response.data });
        console.log('Saved edit for todo:', response.data);
      } catch (error) {
        console.error('Error saving edit:', error);
      }
    }
  };

  const handleAddKeyDown = async (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      await addTodoHandler();
    } 
  };

  const handleEditKeyDown = async (e, id) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      await saveEditHandler(id);
    } else if (e.key === 'Escape') {
      dispatch({ type: 'SET_EDIT_TODO', payload: { id: null, text: '' } });
    }
  };

  const filteredTodos = useMemo(() => {
    console.log('Filtering todos with searchText:', searchText); // Debugging statement
    return todos.filter(todo => todo.text && todo.text.toLowerCase().includes(searchText.toLowerCase()));
  }, [todos, searchText]);

  const sortedTodos = useMemo(() => {
    console.log('Sorting todos with sortType:', sortType, 'and sortOrder:', sortOrder); // Debugging statement
    return filteredTodos.slice().sort((a, b) => {
      let comparison = 0;
      if (sortType === 'created') {
        comparison = new Date(a.createdAt) - new Date(b.createdAt);
      } else if (sortType === 'updated') {
        comparison = new Date(a.updatedAt) - new Date(b.updatedAt);
      } else if (sortType === 'completed') {
        comparison = new Date(a.completedAt) - new Date(b.completedAt);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [filteredTodos, sortType, sortOrder]);

  return (
    <TodoProvider state={state} dispatch={dispatch}>
      <div style={styles.container}>
        <Header />
        <div style={styles.content}>
          <div style={styles.inputWrapper}>
            <AddTaskForm
              newTodoText={newTodoText}
              addInputRef={addInputRef}
              handleAddKeyDown={handleAddKeyDown}
              addTodoHandler={addTodoHandler}
              dispatch={dispatch}
            />
            <div style={styles.filterSortContainer}>
              <input
                type="text"
                placeholder="Search by title"
                value={searchText}
                onChange={(e) => {
                  console.log('Search text updated:', e.target.value);
                  setSearchText(e.target.value);
                }}
                style={{ ...styles.input, margin: '10px 0', width: '100%' }}
              />
              <select value={sortType} onChange={(e) => {
                  console.log('Sort type updated:', e.target.value);
                  setSortType(e.target.value);
                }} style={{ ...styles.select, margin: '10px 0' }}>
                <option value="created">Sort by Created</option>
                <option value="updated">Sort by Updated</option>
                <option value="completed">Sort by Completed</option>
              </select>
              <select value={sortOrder} onChange={(e) => {
                  console.log('Sort order updated:', e.target.value);
                  setSortOrder(e.target.value);
                }} style={{ ...styles.select, margin: '10px 0' }}>
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>
          {isDatabaseConnecting ? (
            <div style={styles.databaseConnecting}>
              <p>Database connecting...</p>
            </div>
          ) : (
            <TodoListItems
              style={styles.list}
              todos={sortedTodos}
              startEditing={startEditing}
              toggleCompletionHandler={toggleCompletionHandler}
              deleteTodoHandler={deleteTodoHandler}
              editId={editId}
              editText={editText}
              editInputRef={editInputRef}
              handleEditChange={(e) => {
                dispatch({ type: 'SET_EDIT_TEXT', payload: e.target.value });
              }}
              handleEditKeyDown={handleEditKeyDown}
              saveEditHandler={saveEditHandler}
              dispatch={dispatch}
            />
          )}
        </div>
        <Footer />
      </div>
    </TodoProvider>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    width: '100vw', // Set width to 100vw
    alignItems: 'center', // Center the container content
  },
  content: {
    flex: '1',
    padding: '20px',
    textAlign: 'center',
    backgroundImage: 'url("/black1.jpg")', // Add background image
    backgroundRepeat: 'no-repeat', // Prevent background repeat
    backgroundPosition: 'center', // Center the background image
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center', // Center the content
    width: '100%', // Ensure content takes full width
  },
  inputWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px'
  },
  inputContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    gap: '10px',
    marginBottom: '20px'
  },
  filterSortContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '20px',
    borderRadius: '6px', // Add border-radius
  },
  input: {
    padding: '10px',
    width: '100%',
    backgroundColor: 'white', // Set background color to white
    borderRadius: '6px', // Add border-radius
    color: 'black' // Set text color to black
  },
  select: {
    padding: '10px',
    width: '200px',
    backgroundColor: 'white', // Set background color to white
    color: 'black', // Set text color to black
    borderRadius: '6px', // Add border-radius
    margin: '10px 0' // Add margin
  },
  button: {
    padding: '10px',
    fontSize: '0.7rem',
    width: '80px',
    borderRadius: '6px', // Add border-radius
  },
  list: {
    listStyleType: 'none',
    padding: '0',
    display: 'grid',
    gap: '10px',
    width: '100vw !important', // Set width to 100vw
  },
  listItem: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)', // 3 columns of equal size
    gap: '10px',
    alignItems: 'center',
    textAlign: 'left',
    borderBottom: '2px solid #ccc' // Add bottom border
  },
  todoText: {
    cursor: 'pointer',
    fontSize: '1rem',
    textAlign: 'left'
  },
  buttons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    padding: '1rem',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  databaseConnecting: {
    textAlign: 'center',
    marginTop: '20px',
    fontSize: '1.7rem',
    color: '#fff',
  },
};

export default TodoListContainer;