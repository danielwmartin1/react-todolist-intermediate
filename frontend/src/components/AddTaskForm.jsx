import React, { useState } from 'react';
import './AddTaskForm.css';
import './TodoListMediaQueries.css';

const AddTaskForm = ({ newTodoText, addInputRef, handleAddKeyDown, addTodoHandler, dispatch }) => {
  const [buttonStyle, setButtonStyle] = useState(styles.button);

  const handleBlur = () => {
    // Reset the input field when it loses focus
    dispatch({ type: 'RESET_NEW_TODO_TEXT' });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.target.blur(); // Blur the input field on Escape key
      return;
    } else {
      handleAddKeyDown(e); // Handle other key presses
    }
  };

  return (
    <div style={styles.inputContainer}>
      <input
        ref={addInputRef}
        type="text"
        value={newTodoText}
        onChange={(e) => {
          dispatch({ type: 'SET_NEW_TODO_TEXT', payload: e.target.value });
        }}
        placeholder="Add a new task"
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        style={styles.input}
      />
      <button
        onClick={addTodoHandler}
        style={{ ...buttonStyle, backgroundColor: 'green' }}
        onMouseEnter={() => setButtonStyle({ ...styles.button, ...styles.buttonHover })}
        onMouseLeave={() => setButtonStyle(styles.button)}
        onMouseDown={() => setButtonStyle({ ...styles.button, ...styles.buttonActive })}
        onMouseUp={() => setButtonStyle({ ...styles.button, ...styles.buttonHover })}
      >
        Add
      </button>
    </div>
  );
};

const styles = {
  inputContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    gap: '10px',
    marginBottom: '20px',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '10px'
  },
  input: {
    padding: '0 10px',
    width: '87.5%',
    margin: '0px',
    borderRadius: '6px',
    backgroundColor: '#fff',
    color: '#333',
    height: '40px',
  },
  button: {
    padding: '10px',
    fontSize: '0.7rem',
    width: '100px',
    margin: '10px',
    borderRadius: '6px',
    height: '40px',
    transition: 'transform 0.1s',
  },
  buttonHover: {
    transform: 'scale(1.05)',
  },
  buttonActive: {
    transform: 'scale(0.95)',
  }
};
export default AddTaskForm;