import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const uri = 'mongodb+srv://danielwmartin1:Mack2020!!@cluster0.ikgzxfz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const todoSchema = new mongoose.Schema({
  text: String,
  completed: Boolean
});

const Todo = mongoose.model('Todo', todoSchema);

app.get('/todos', async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

app.listen(5001, () => {
  console.log('Server is running on port 5001');
});
```
```javascript
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TodoList = () => {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const fetchTodos = async () => {
      const response = await axios.get('http://localhost:5001/todos');
      setTodos(response.data);
    };

    fetchTodos();
  }, []);

  return (
    <div>
      <h1>Todo List</h1>
      <ul>
        {todos.map(todo => (
          <li key={todo._id}>
            {todo.text} - {todo.completed ? 'Completed' : 'Incomplete'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
