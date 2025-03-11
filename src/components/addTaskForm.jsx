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