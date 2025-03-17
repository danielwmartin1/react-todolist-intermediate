import React, { useState } from 'react';
import './AddTaskForm.css';
import './TodoListMediaQueries.css';

const AddTaskForm = ({ newTodoText, addInputRef, handleAddKeyDown, addTodoHandler, dispatch }) => {
  const [buttonStyle, setButtonStyle] = useState(styles.button);

  const handleBlur = () => {
    dispatch({ type: 'RESET_NEW_TODO_TEXT' });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.target.blur();
      return;
    } else {
      handleAddKeyDown(e);
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
    padding: '0 10px', // increased by 50%
    width: '87.5%',
    margin: '0px',
    borderRadius: '6px', // added border-radius
    backgroundColor: '#fff', // added background color
    color: '#333', // added text color
    height: '40px', // set height
  },
  button: {
    padding: '10px',
    fontSize: '0.7rem',
    width: '100px', // added margin to the
    margin: '10px', // added margin to theadius
    borderRadius: '6px', // added border-radius
    height: '40px', // set height // added transition for transform
    transition: 'transform 0.1s', // added transition for transform
  },
  buttonHover: {
    transform: 'scale(1.05)', // scale up on hover
  },
  buttonActive: {
    transform: 'scale(0.95)', // scale down on active
  }
};
export default AddTaskForm;