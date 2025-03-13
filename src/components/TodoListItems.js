import React from 'react';

const TodoListItems = ({ todos, onEdit, onComplete }) => {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo._id}>
          <span>{todo.task}</span>
          <button onClick={() => onEdit(todo._id, todo.task)}>Edit</button>
          <button onClick={() => onComplete(todo._id)}>Complete</button>
        </li>
      ))}
    </ul>
  );
};

export default TodoListItems;
