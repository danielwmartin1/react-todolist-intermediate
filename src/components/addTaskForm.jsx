import React, { useState } from 'react';

const AddTaskForm = ({ newTodoText, addInputRef, handleAddKeyDown, addTodoHandler, dispatch }) => {
  const [buttonStyle, setButtonStyle] = useState(styles.button);

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
    alignItems: 'center'
  },
  input: {
    padding: '0 10px', // increased by 50%
    width: '87.5%',
    margin: '10px 0',
    borderRadius: '6px', // added border-radius
    backgroundColor: '#f9f9f9',
    height: '40px', // set height
  },
  button: {
    padding: '10px',
    fontSize: '0.7rem',
    width: '80px',
    margin: '10px 0',
    borderRadius: '6px', // added border-radius
    height: '40px', // set height
    transition: 'transform 0.2s', // added transition for transform
  },
  buttonHover: {
    transform: 'scale(1.05)', // scale up on hover
  },
  buttonActive: {
    transform: 'scale(0.95)', // scale down on active
  }
};

export default AddTaskForm;