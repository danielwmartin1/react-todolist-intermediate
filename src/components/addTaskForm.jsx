import React from 'react';

const AddTaskForm = ({ newTodoText, addInputRef, handleAddKeyDown, addTodoHandler, dispatch }) => {
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
      <button onClick={addTodoHandler} style={{ ...styles.button, backgroundColor: 'green' }}>Add</button>
    </div>
  );
};

const styles = {
  inputContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    gap: '10px',
    marginBottom: '20px'
  },
  input: {
    padding: '10px',
    width: '88%',
    margin: '10px 0'
  },
  button: {
    padding: '10px',
    fontSize: '0.7rem',
    width: '80px',
    margin: '10px 0'
  }
};

export default AddTaskForm;