import React from 'react';

const TodoListItems = ({ todos }) => {
    return (
        <ul>
            {todos.map(todo => (
                <li key={todo._id}>
                    <span>{todo.text}</span>
                    <span>{new Date(todo.updatedAt).toLocaleString()}</span> {/* Display updatedAt */}
                </li>
            ))}
        </ul>
    );
};

export default TodoListItems;
