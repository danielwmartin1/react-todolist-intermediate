import React from 'react';
import TodoItem from './TodoItem';

const TodoList = ({ todos, onDelete, onUpdate }) => {
    return (
        <div>
            {todos.map(todo => (
                <TodoItem key={todo._id} todo={todo} onDelete={onDelete} onUpdate={onUpdate} />
            ))}
        </div>
    );
};

export default TodoList;
