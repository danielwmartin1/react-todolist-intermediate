import { useReducer, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const initialState = {
  todos: [],
  loading: true,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_SUCCESS':
      return {
        ...state,
        todos: action.payload,
        loading: false,
      };
    case 'FETCH_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case 'ADD_TODO':
      return {
        ...state,
        todos: [...state.todos, action.payload],
      };
    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo._id === action.payload._id ? action.payload : todo
        ),
      };
    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter(todo => todo._id !== action.payload),
      };
    default:
      return state;
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    axios.get('http://localhost:5001/todos') // Updated port number
      .then(response => {
        dispatch({ type: 'FETCH_SUCCESS', payload: response.data });
      })
      .catch(error => {
        dispatch({ type: 'FETCH_ERROR', payload: error.message });
      });
  }, []);

  const addTodo = (text) => {
    axios.post('http://localhost:5001/todos', { text }) // Updated port number
      .then(response => {
        dispatch({ type: 'ADD_TODO', payload: response.data });
      });
  };

  const toggleTodo = (id, completed) => {
    axios.put(`http://localhost:5001/todos/${id}`, { completed }) // Updated port number
      .then(response => {
        dispatch({ type: 'TOGGLE_TODO', payload: response.data });
      });
  };

  const deleteTodo = (id) => {
    axios.delete(`http://localhost:5001/todos/${id}`) // Updated port number
      .then(() => {
        dispatch({ type: 'DELETE_TODO', payload: id });
      });
  };

  if (state.loading) {
    return <div>Loading...</div>;
  }

  if (state.error) {
    return <div>Error: {state.error}</div>;
  }

  return (
    <div className="App">
      <h1>Todo List</h1>
      <input type="text" placeholder="Add a todo" onKeyDown={(e) => {
        if (e.key === 'Enter') {
          addTodo(e.target.value);
          e.target.value = '';
        }
      }} />
      <ul>
        {state.todos.map(todo => (
          <li key={todo._id}>
            <span
              style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
              onClick={() => toggleTodo(todo._id, !todo.completed)}
            >
              {todo.text}
            </span>
            <button onClick={() => deleteTodo(todo._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
