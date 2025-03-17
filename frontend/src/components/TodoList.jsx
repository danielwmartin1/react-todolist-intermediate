import React, { useEffect, useReducer, useRef, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import './TodoList.css';
import { fetchTodos, addTodo, toggleCompletion, deleteTodo, saveEdit } from '../services/todoService';
import TodoItem from './TodoItem';
import { TodoProvider } from '../context/TodoContext';
import AddTaskForm from './AddTaskForm';
import TodoListItems from './TodoListItems.jsx';

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

const TodoList = ({ todos, onEdit, onComplete, onDelete }) => {
  const [editText, setEditText] = useState('');
  const [isEditing] = useState(null);

  const handleEditChange = (e) => {
    setEditText(e.target.value);
  };

  const handleEditKeyDown = (e, id) => {
    if (e.key === 'Enter') {
      saveEditHandler(id);
    }
  };

  const saveEditHandler = (id) => {
    onEdit(id, editText);
  };

  const handleDelete = (id) => {
    onDelete(id);
  };

  return (
    <ul>
      {todos.map((todo) => (
        <TodoItem
          key={todo._id}
          todo={todo}
          onEdit={onEdit}
          onComplete={onComplete}
          onDelete={handleDelete}
          isEditing={isEditing === todo._id}
          editText={editText}
          handleEditChange={handleEditChange}
          handleEditKeyDown={handleEditKeyDown}
          saveEditHandler={saveEditHandler}
        />
      ))}
    </ul>
  );
};

const TodoListContainer = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { todos, newTodoText, editId, editText } = state;
  const [searchText, setSearchText] = useState('');
  const [sortType, setSortType] = useState('created');
  const [sortOrder, setSortOrder] = useState('asc');
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
  }, []);

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
      <div className="container">
        <Header />
        <div className="content">
          <div className="inputWrapper">
            <AddTaskForm
              newTodoText={newTodoText}
              addInputRef={addInputRef}
              handleAddKeyDown={handleAddKeyDown}
              addTodoHandler={addTodoHandler}
              dispatch={dispatch}
            />
            <div className="filterSortContainer">
              <input
                type="text"
                placeholder="Search by title"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="input"
              />
              <select value={sortType} onChange={(e) => setSortType(e.target.value)} className="select">
                <option value="created">Sort by Created</option>
                <option value="updated">Sort by Updated</option>
                <option value="completed">Sort by Completed</option>
              </select>
              <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="select">
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>
          <TodoListItems
            sortedTodos={sortedTodos}
            editId={editId}
            editText={editText}
            editInputRef={editInputRef}
            handleEditKeyDown={handleEditKeyDown}
            startEditing={startEditing}
            saveEditHandler={saveEditHandler}
            toggleCompletionHandler={toggleCompletionHandler}
            deleteTodoHandler={deleteTodoHandler}
            dispatch={dispatch}
          />
        </div>
        <Footer />
      </div>
    </TodoProvider>
  );
};

export default TodoListContainer;
