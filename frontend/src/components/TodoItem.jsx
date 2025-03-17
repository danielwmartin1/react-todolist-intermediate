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

  const formatDate = (date) => {
    return date ? new Date(date).toLocaleString() : '';
  };

  return (
    <li style={{ ...styles.listItem, opacity: todo.completed ? 0.7 : 1 }}>
      <div style={styles.checkboxContainer}>
        {!isEditing && (
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => onComplete(todo._id, !todo.completed)} // Pass the new completed state
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
          }} style={{ ...styles.button, backgroundColor: 'blue', width: '140px', transition: 'transform 0.1s', cursor: 'pointer' }} 
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'} 
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'} 
          onMouseDown={(e) => e.target.style.transform = 'scale(0.95)'} 
          onMouseUp={(e) => e.target.style.transform = 'scale(1)'}>Save</button> {/* Updated width */}
        </div>
      ) : (
        <>
          <span style={{ ...styles.todoText, textDecoration: todo.completed ? 'line-through' : 'none' }}>{todo.text}</span>
          {todo.createdAt && (
            <div style={styles.timestampsContainer}>
              <div style={styles.timestamps}>
                <span style={{ fontSize: '0.8rem' }}>Created: {formatDate(todo.createdAt)}</span>
                {todo.updatedAt && todo.updatedAt !== todo.createdAt && (
                  <span style={{ fontSize: '0.8rem' }}>Updated: {formatDate(todo.updatedAt)}</span>
                )}
                {todo.completed && todo.completedAt && (
                  <span style={{ fontSize: '0.8rem' }}>Completed: {formatDate(todo.completedAt)}</span>
                )}
              </div>
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
            }} style={{ ...styles.button, backgroundColor: 'orange', transition: 'transform 0.1s', cursor: 'pointer' }} 
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'} 
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'} 
            onMouseDown={(e) => e.target.style.transform = 'scale(0.95)'} 
            onMouseUp={(e) => e.target.style.transform = 'scale(1)'}>Edit</button>
            <button onClick={() => {
              console.log('Delete button clicked for todo:', todo); // Debugging statement
              onDelete(todo._id);
            }} style={{ ...styles.button, backgroundColor: 'red', transition: 'transform 0.1s', cursor: 'pointer' }} 
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'} 
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'} 
            onMouseDown={(e) => e.target.style.transform = 'scale(0.95)'} 
            onMouseUp={(e) => e.target.style.transform = 'scale(1)'}>Delete</button>
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
    padding: '1rem',
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
    width: '100px', // Standardize button width
    fontSize: '0.8rem', // Standardize font size
    transition: 'transform 0.1s', // added transition for transform
    cursor: 'pointer', // Add pointer cursor for buttons
  },
  editContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px', // Add some space between input and button
  },
  timestampsContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    textAlign: 'left',
  },
  timestamps: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    textAlign: 'left',
    gap: '5px', // Add some gap between timestamp items
  },
};

export default TodoItem;
