import React, { useState } from 'react';

const TodoItem = ({ todo, onDelete, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [text, setText] = useState(todo.text);

    const handleUpdate = () => {
        onUpdate(todo._id, { text, completed: todo.completed });
        setIsEditing(false);
    };

    return (
        <div>
            {isEditing ? (
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
            ) : (
                <span>{todo.text}</span>
            )}
            <button onClick={() => {
                console.log(`Deleting todo with id: ${todo._id}`);
                onDelete(todo._id);
            }}>Delete</button>
            <button onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? 'Save' : 'Edit'}
            </button>
            <button onClick={() => onUpdate(todo._id, { completed: !todo.completed })}>
                {todo.completed ? 'Mark Incomplete' : 'Mark Complete'}
            </button>
            {isEditing && <button onClick={handleUpdate}>Save</button>}
        </div>
    );
};

export default TodoItem;