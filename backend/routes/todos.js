import express from 'express';
import Todo from '../models/todoModel.js'; // Import the Todo model

const router = express.Router();

// Get all todos
router.get('/', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a new todo
router.post('/', async (req, res) => {
  const todo = new Todo({
    text: req.body.text,
    completed: req.body.completed || false
  });

  try {
    const newTodo = await todo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Toggle completion of a todo
router.patch('/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    todo.completed = req.body.completed;
    todo.completedAt = req.body.completed ? new Date() : null;
    const updatedTodo = await todo.save();
    res.json(updatedTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a todo
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      console.error('ID parameter is missing'); // Log missing ID
      return res.status(400).json({ message: 'ID parameter is required' });
    }
    console.log('DELETE request received for ID:', id); // Log the ID being processed

    if (!id.match(/^[0-9a-fA-F]{24}$/)) { // Validate MongoDB ObjectId format
      console.error('Invalid ID format:', id); // Log invalid ID format
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const todo = await Todo.findByIdAndDelete(id); // Use findByIdAndDelete to delete the todo
    if (!todo) {
      console.error('Todo not found for ID:', id); // Log if the todo is not found
      return res.status(404).json({ message: 'Todo not found' });
    }

    console.log('Todo successfully deleted for ID:', id); // Log successful deletion
    res.json({ message: 'Todo deleted' });
  } catch (error) {
    console.error('Error deleting todo for ID:', id, error); // Log the error with the ID
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Save edit to a todo
router.put('/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    todo.text = req.body.text;
    todo.completed = req.body.completed;
    todo.completedAt = req.body.completed ? new Date() : null;
    const updatedTodo = await todo.save();
    res.json(updatedTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
