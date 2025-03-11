import React from 'react';

const TodoItem = ({ todo }) => {
  return (
    <div style={styles.todoItem}>
      <div className="timeStamps" style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
        {todo.createdAt && <p>Created At: {new Date(todo.createdAt).toLocaleString()}</p>}
        {todo.updatedAt && <p>Updated At: {new Date(todo.updatedAt).toLocaleString()}</p>}
        {todo.completedAt && <p>Completed At: {new Date(todo.completedAt).toLocaleString()}</p>}
      </div>
    </div>
  );
};

const styles = {
  todoItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
  },
  todoText: {
    flex: '1',
    cursor: 'pointer',
    textAlign: 'left'
  },
  button: {
    padding: '10px',
    fontSize: '0.7rem',
    width: '80px'
  }
};

export default TodoItem;
