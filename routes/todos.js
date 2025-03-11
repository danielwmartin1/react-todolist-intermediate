import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

const todoSchema = new mongoose.Schema({
  text: String,
  completed: Boolean
});

const Todo = mongoose.model('Todo', todoSchema);

router.get('/todos', async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

router.post('/todos', async (req, res) => {
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

router.put('/todos/:id', async (req, res) => {
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

router.patch('/todos/:id', async (req, res) => {
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

router.delete('/todos/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await Todo.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).send(error);
  } 
});

export default router;
