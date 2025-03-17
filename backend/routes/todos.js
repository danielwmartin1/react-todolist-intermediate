import express from 'express';
import Todo from '../models/todo.js'; // Import the Todo model

const router = express.Router();

// Define your routes here
// Example:
router.get('/', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
