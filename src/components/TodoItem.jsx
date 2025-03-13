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
          ref={editInputRef} // Attach the ref to the input element
        />
      ) : (
        <span style={{ ...styles.todoText, textDecoration: todo.completed ? 'line-through' : 'none' }}>{todo.text}</span>
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
    display: 'flex',
    justifyContent: 'space-between',
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
