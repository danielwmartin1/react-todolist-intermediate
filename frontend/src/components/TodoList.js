import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import Todo from './models/Todo.js';

const app = express();
app.use(cors());
app.use(express.json());

dotenv.config();

const uri = process.env.MONGODB_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/todos', async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

app.post('/todos', async (req, res) => {
  const { text } = req.body;

  try {
    const newTodo = new Todo({
      text,
      completed: false
    });
    await newTodo.save();
    res.json(newTodo);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.put('/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  console.log(`Received PUT request to update todo with id: ${id}`);
  console.log(`New text: ${text}`);

  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { text },
      { new: true }
    );
    console.log(`Updated todo: ${updatedTodo}`);
    res.json(updatedTodo);
  } catch (error) {
    console.error(`Error updating todo: ${error}`);
    res.status(500).send(error);
  }
});

app.patch('/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { text, completed } = req.body;

  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { text, completed },
      { new: true }
    );
    res.json(updatedTodo);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.delete('/todos/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await Todo.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).send(error);
  } 
});

app.listen(5001, () => {
  console.log('Server is running on port 5001');
});
