import React from 'react';
import TodoItem from './TodoItem.jsx'; // Ensure the correct extension is used

const TodoListItems = ({ todos, startEditing, toggleCompletionHandler, deleteTodoHandler, editId, editText, handleEditChange, handleEditKeyDown, saveEditHandler }) => {
  console.log('TodoListItems rendered with todos:', todos); // Debugging statement
  return (
    <ul style={styles.list}>
      {todos.map((todo) => (
        <TodoItem
          key={todo._id}
          todo={todo}
          onEdit={startEditing}
          onComplete={toggleCompletionHandler}
          onDelete={deleteTodoHandler} // Pass deleteTodoHandler
          isEditing={editId === todo._id}
          editText={editText}
          handleEditChange={handleEditChange}
          handleEditKeyDown={handleEditKeyDown}
          saveEditHandler={saveEditHandler} // Pass saveEditHandler
        />
      ))}
    </ul>
  );
};

const styles = {
  list: {
    listStyleType: 'none', // Remove bullets
    padding: '0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center', // Center the list
    gap: '10px',
    width: '100vw', // Ensure list takes full width
  },
};

export default TodoListItems;