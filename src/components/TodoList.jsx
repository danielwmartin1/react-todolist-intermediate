import React, { useEffect, useReducer, useRef, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import './TodoListMediaQueries.css'; // Import the new CSS file
import { fetchTodos, addTodo, toggleCompletion, deleteTodo, saveEdit } from '../services/todoService';
import TodoItem from './TodoItem'; // Import the TodoItem component
import { TodoProvider } from '../context/TodoContext'; // Import the TodoProvider
import AddTaskForm from './AddTaskForm'; // Import the AddTaskForm component

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
  const [searchText, setSearchText] = useState('');
  const [sortType, setSortType] = useState('created');
  const [sortOrder, setSortOrder] = useState('asc'); // Add state for sort order
  const addInputRef = useRef(null);
  const editInputRef = useRef(null);

  useEffect(() => {
    const fetchTodosData = async () => {
      try {
        console.log('Fetching todos...');
        const response = await fetchTodos();
        dispatch({ type: 'SET_TODOS', payload: response.data });
        console.log('Fetched todos:', response.data);
        if (addInputRef.current) {
          addInputRef.current.focus();
        }
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    };

    fetchTodosData();
  }, []); // Ensure this useEffect runs only once on mount

  useEffect(() => {
    if (editId && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editId]);

  const addTodoHandler = async () => {
    if (newTodoText.trim()) {
      try {
        console.log('Adding new todo:', newTodoText);
        const response = await addTodo(newTodoText);
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

  const toggleCompletionHandler = async (id, completed) => {
    try {
      console.log('Toggling completion for todo:', id);
      const response = await toggleCompletion(id, completed);
      dispatch({ type: 'UPDATE_TODO', payload: response.data });
      console.log('Toggled completion for todo:', response.data);
    } catch (error) {
      console.error('Error toggling completion:', error);
    }
  };

  const deleteTodoHandler = async (id) => {
    try {
      console.log('Deleting todo:', id);
      await deleteTodo(id);
      dispatch({ type: 'DELETE_TODO', payload: id });
      console.log('Deleted todo:', id);
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const startEditing = (todo) => {
    dispatch({ type: 'SET_EDIT_TODO', payload: { id: todo._id, text: todo.text } });
    dispatch({ type: 'SET_EDIT_TEXT', payload: todo.text }); // Ensure editText is set
  };

  const saveEditHandler = async (id) => {
    if (editText.trim() && editText.trim() !== newTodoText.trim()) { // Ensure editText is different from newTodoText
      try {
        const todo = todos.find(todo => todo._id === id);
        if (editText.trim() === todo.text.trim()) { // Exit editing if editText is the same as the original text
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
      e.preventDefault(); // Prevent default form submission
      await addTodoHandler();
    } 
  };

  const handleEditKeyDown = async (e, id) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent default form submission
      await saveEditHandler(id);
    } else if (e.key === 'Escape') {
      dispatch({ type: 'SET_EDIT_TODO', payload: { id: null, text: '' } });
    }
  };

  const filterTodos = (todos, searchText) => {
    return todos.filter(todo => todo.text.toLowerCase().includes(searchText.toLowerCase()));
  };

  const sortTodos = (todos, sortType, sortOrder) => {
    return todos.slice().sort((a, b) => {
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
  };

  const filteredTodos = filterTodos(todos, searchText);
  const sortedTodos = sortTodos(filteredTodos, sortType, sortOrder);

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
                onChange={(e) => setSearchText(e.target.value)}
                style={{ ...styles.input, margin: '10px 0', width: '100%' }} // Add margin and reduce width
              />
              <select value={sortType} onChange={(e) => setSortType(e.target.value)} style={{ ...styles.select, margin: '10px 0' }}> {/* Add margin */}
                <option value="created">Sort by Created</option>
                <option value="updated">Sort by Updated</option>
                <option value="completed">Sort by Completed</option>
              </select>
              <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} style={{ ...styles.select, margin: '10px 0' }}> {/* Add margin */}
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>
          <ul style={styles.list}>
            {sortedTodos.map(todo => (
              <li key={todo._id} style={{ ...styles.listItem, opacity: todo.completed ? 0.6 : 1 }}>
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
                  <span onClick={() => startEditing(todo)} style={{ ...styles.todoText, textDecoration: todo.completed ? 'line-through' : 'none' }}>
                    {todo.text}
                  </span>
                )}
                <TodoItem todo={todo} onEdit={startEditing} onComplete={toggleCompletionHandler} />
                <div className="buttons" style={styles.buttons}>
                  {editId === todo._id ? (
                    <button onClick={() => saveEditHandler(todo._id)} style={{ ...styles.button, backgroundColor: 'blue' }}>Save</button>
                  ) : (
                    <button onClick={() => toggleCompletionHandler(todo._id, todo.completed)} style={{ ...styles.button, backgroundColor: 'purple' }}>
                      {todo.completed ? 'Incomplete' : 'Complete'}
                    </button>
                  )}
                  <button onClick={() => deleteTodoHandler(todo._id)} style={{ ...styles.button, backgroundColor: 'red' }}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
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
    minHeight: '100vh'
  },
  content: {
    flex: '1',
    padding: '20px',
    textAlign: 'center'
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
    gap: '10px'
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
  }
};

export default TodoList;
