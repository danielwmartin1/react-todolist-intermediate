import React, { useEffect, useRef } from 'react';

const TodoItem = ({ todo, onEdit, onComplete, isEditing, editText, handleEditChange, handleEditKeyDown, saveEditHandler }) => {
  const editInputRef = useRef(null);

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <li style={{ ...styles.listItem, opacity: todo.completed ? 0.7 : 1 }}>
      {isEditing ? (
        <input
          type="text"
          value={editText}
          onChange={handleEditChange}
          onKeyDown={(e) => handleEditKeyDown(e, todo._id)}
          style={styles.input}
            ref={editInputRef}
          />
                ) : (
            <>
              <span style={{ ...styles.todoText, textDecoration: todo.completed ? 'line-through' : 'none' }}>{todo.text}</span>
              {todo.createdAt && todo.updatedAt && (
                <div style={{ ...styles.timestamps, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.8rem' }}>Created: {new Date(todo.createdAt).toLocaleString()}</span>
                  <span style={{ fontSize: '0.8rem' }}>Updated: {new Date(todo.updatedAt).toLocaleString()}</span>
                  <span style={{ fontSize: '0.8rem' }}>{todo.completed ? `Completed: ${new Date(todo.updatedAt).toLocaleString()}` : ''}</span>
                </div>
              )}
            </>
                )}
            <div style={styles.buttons}>
            {isEditing ? (
              <button onClick={() => {
            console.log('Save button clicked for todo:', todo); // Debugging statement
            saveEditHandler(todo._id);
          }} style={{ ...styles.button, backgroundColor: 'blue' }}>Save</button>
        ) : (
          <button onClick={() => {
            console.log('Edit button clicked for todo:', todo); // Debugging statement
            onEdit(todo);
          }} style={{ ...styles.button, backgroundColor: 'orange' }}>Edit</button>
        )}
        <button onClick={() => {
          console.log('Complete button clicked for todo:', todo); // Debugging statement
          onComplete(todo._id, todo.completed);
        }} style={{ ...styles.button, backgroundColor: 'purple' }}>Complete</button>
      </div>
    </li>
  );
};

const styles = {
  listItem: {
    display: 'grid',
    gridTemplateColumns: '3fr 2fr 1fr',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    maxWidth: '600px', // Limit the width of the list items
    padding: '10px',
    borderBottom: '2px solid #ccc', // Add bottom border
  },
  todoText: {
    cursor: 'pointer',
    fontSize: '1rem',
    textAlign: 'left',
  },
  buttons: {
    flexDirection: 'column',
    display: 'flex',
    gap: '10px',
  },
  input: {
    padding: '10px',
    width: '100%',
    borderRadius: '6px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '10px',
    borderRadius: '6px',
    width: '80px',
    fontSize: '0.7rem',
    transition: 'transform 0.2s', // added transition for transform
  },
};

export default TodoItem;
