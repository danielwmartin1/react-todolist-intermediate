import React, { useEffect, useReducer, useRef } from 'react';
import Header from './Header';
import Footer from './Footer';
import './TodoListMediaQueries.css'; // Import the new CSS file
import { fetchTodos, addTodo, toggleCompletion, deleteTodo, saveEdit } from '../services/todoService';
import TodoItem from './TodoItem'; // Import the TodoItem component
import { TodoProvider } from '../context/TodoContext'; // Import the TodoProvider

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
    } else if (e.key === 'Escape') {
      addInputRef.current.blur();
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

  const AddTaskForm = ({ newTodoText, addInputRef, handleAddKeyDown, addTodoHandler, dispatch }) => {
    return (
      <div style={styles.inputContainer}>
        <input
          ref={addInputRef}
          type="text"
          value={newTodoText}
          onChange={(e) => dispatch({ type: 'SET_NEW_TODO_TEXT', payload: e.target.value })}
          placeholder="Add a new task"
          onKeyDown={handleAddKeyDown}
          style={styles.input}
        />
        <button onClick={addTodoHandler} style={{ ...styles.button, backgroundColor: 'green' }}>Add</button>
      </div>
    );
  };

  return (
    <TodoProvider state={state} dispatch={dispatch}>
      <div style={styles.container}>
        <Header />
        <div style={styles.content}>
          <AddTaskForm
            newTodoText={newTodoText}
            addInputRef={addInputRef}
            handleAddKeyDown={handleAddKeyDown}
            addTodoHandler={addTodoHandler}
            dispatch={dispatch}
          />
          <ul style={styles.list}>
            {todos.map(todo => (
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
  inputContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    gap: '10px',
    marginBottom: '20px'
  },
  input: {
    padding: '10px',
    width: '100%'
  },
  button: {
    padding: '10px',
    fontSize: '0.7rem',
    width: '80px'
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
    gap: '5px',
    padding: '1rem',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'flex-end'
  }
};

export default TodoList;
