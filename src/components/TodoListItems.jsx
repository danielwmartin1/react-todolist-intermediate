import React from 'react';
import TodoItem from './TodoItem';

const TodoListItems = ({
  sortedTodos,
  editId,
  editText,
  editInputRef,
  handleEditKeyDown,
  startEditing,
  saveEditHandler,
  toggleCompletionHandler,
  deleteTodoHandler,
  dispatch
}) => {
  return (
    <ul style={{ ...styles.list, backgroundImage: 'url("blue-brick.jpg")', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}>
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
  );
};

const styles = {
  list: {
    listStyleType: 'none',
    padding: '0',
    display: 'grid',
    gap: '10px',
  },
  listItem: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '10px',
    alignItems: 'center',
    textAlign: 'left',
    borderBottom: '2px solid #ccc'
  },
  input: {
    padding: '10px',
    width: '100%',
    backgroundColor: 'white',
    borderRadius: '6px',
    color: 'black'
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
  button: {
    padding: '10px',
    fontSize: '0.7rem',
    width: '80px',
    borderRadius: '6px',
  }
};

export default TodoListItems;
