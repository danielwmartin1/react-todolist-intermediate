import React, { useEffect, useRef } from 'react';

const TodoItem = ({ todo, onEdit, onComplete, onDelete, isEditing, editText, handleEditChange, handleEditKeyDown, saveEditHandler }) => {
  const editInputRef = useRef(null);

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [isEditing]);

  const handleBlur = () => {
    saveEditHandler(todo._id);
  };

  return (
    <li style={{ ...styles.listItem, opacity: todo.completed ? 0.7 : 1 }}>
      <div style={styles.checkboxContainer}>
        {!isEditing && (
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => onComplete(todo._id, todo.completed)}
            style={styles.checkbox}
          />
        )}
      </div>
      {isEditing ? (
        <div style={styles.editContainer}>
          <input
            type="text"
            value={editText}
            onChange={handleEditChange}
            onKeyDown={(e) => handleEditKeyDown(e, todo._id)}
            onBlur={handleBlur}
            style={styles.input}
            ref={editInputRef}
          />
          <button onClick={() => {
            console.log('Save button clicked for todo:', todo); // Debugging statement
            saveEditHandler(todo._id);
          }} style={{ ...styles.button, backgroundColor: 'blue' }}>Save</button>
        </div>
      ) : (
        <>
          <span style={{ ...styles.todoText, textDecoration: todo.completed ? 'line-through' : 'none' }}>{todo.text}</span>
          {todo.createdAt && (
            <div style={{ ...styles.timestamps, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.8rem' }}>Created: {new Date(todo.createdAt).toLocaleString()}</span>
              {todo.updatedAt && todo.updatedAt !== todo.createdAt && (
                <span style={{ fontSize: '0.8rem' }}>Updated: {new Date(todo.updatedAt).toLocaleString()}</span>
              )}
              <span style={{ fontSize: '0.8rem' }}>{todo.completed ? `Completed: ${new Date(todo.updatedAt).toLocaleString()}` : ''}</span>
            </div>
          )}
        </>
      )}
      <div style={styles.buttons}>
        {!isEditing && (
          <>
            <button onClick={() => {
              console.log('Edit button clicked for todo:', todo); // Debugging statement
              onEdit(todo);
            }} style={{ ...styles.button, backgroundColor: 'orange' }}>Edit</button>
            <button onClick={() => {
              console.log('Delete button clicked for todo:', todo); // Debugging statement
              onDelete(todo._id);
            }} style={{ ...styles.button, backgroundColor: 'red' }}>Delete</button>
          </>
        )}
      </div>
    </li>
  );
};

const styles = {
  listItem: {
    display: 'grid',
    gridTemplateColumns: '1fr 3fr 2fr 1fr', // Adjusted grid template columns
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: '10px',
    borderBottom: '2px solid #ccc', // Add bottom border
  },
  checkboxContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkbox: {
    marginRight: '10px', // Add some margin to the right of the checkbox
    cursor: 'pointer', // Add pointer cursor for checkbox
  },
  todoText: {
    fontSize: '1rem',
    textAlign: 'left',
  },
  buttons: {
    flexDirection: 'column',
    display: 'flex',
    gap: '10px',
  },
  input: {
    marginLeft: '150px', // Add some margin to the left of the input
    marginRight: '20px',
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
    transition: 'transform 0.1s', // added transition for transform
    cursor: 'pointer', // Add pointer cursor for buttons
    ':hover': {
      transform: 'scale(1.05) !important', // Add hover effect
    },
    ':active': {
      transform: 'scale(0.95) !important', // Add active effect
    },
  },
  editContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px', // Add some space between input and button
  },
  timestamps: {
    // ...existing code...
  },
};

export default TodoItem;
