import express from 'express';
import Todo from '../../models/Todo';

const router = express.Router();

// Get all todos
router.get('/', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ message: 'Error fetching todos', error });
  }
});

// Create a new todo
router.post('/', async (req, res) => {
  try {
    const { text } = req.body;
    const newTodo = new Todo({ text });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ message: 'Error creating todo', error });
  }
});

// Update a todo
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { text, completed } = req.body;
    console.log('Updating todo:', id, { text, completed });
    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { text, completed },
      { new: true }
    );
    if (!updatedTodo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.json(updatedTodo);
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ message: 'Error updating todo', error });
  }
});

// Delete a todo
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTodo = await Todo.findByIdAndDelete(id);
    if (!deletedTodo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.json({ message: 'Todo deleted' });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ message: 'Error deleting todo', error });
  }
});

export default router;