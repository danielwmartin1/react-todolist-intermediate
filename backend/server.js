import express from 'express';
import process from 'node:process';
import cors from 'cors'; // Import CORS middleware
import mongoose from 'mongoose'; // Import mongoose
import Todo from '../todo.js'; // Import the Todo model

const app = express();
const port = typeof process !== 'undefined' && process.env.PORT ? process.env.PORT : 5001;

// MongoDB connection setup
const mongoURI = process.env.MONGO_URI || 'mongodb+srv://danielwmartin1:Mack2020!!@cluster0.ikgzxfz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
console.log(`Connecting to MongoDB at: ${mongoURI}`); // Log the MongoDB URI
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Middleware setup
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies

// Example route to test server
app.get('/api/test', (req, res) => {
    console.log('GET /api/test');
    res.send('Server is running');
});

// Define the /api/todos route
app.get('/api/todos', async (req, res) => {
    console.log('GET /api/todos');
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (err) {
        console.error('Error fetching todos:', err);
        res.status(500).json({ message: err.message });
    }
});

// Add a route to create a new todo item
app.post('/api/todos', async (req, res) => {
    const { text, completed } = req.body;
    console.log('POST /api/todos', req.body);

    // Validate request body
    if (!text) {
        console.error('Text is required');
        return res.status(400).json({ message: 'Text is required' });
    }

    const newTodo = new Todo({
        text,
        completed: completed || false
    });

    try {
        const savedTodo = await newTodo.save();
        console.log('Todo created:', savedTodo);
        res.status(201).json(savedTodo);
    } catch (err) {
        console.error('Error creating todo:', err);
        res.status(400).json({ message: err.message });
    }
});

// Add a route to update a todo item
app.put('/api/todos/:id', async (req, res) => {
    const { text, completed } = req.body;
    console.log('PUT /api/todos/:id', req.params.id, req.body);

    try {
        const updatedTodo = await Todo.findByIdAndUpdate(
            req.params.id,
            { text, completed },
            { new: true }
        );
        console.log('Todo updated:', updatedTodo);
        res.json(updatedTodo);
    } catch (err) {
        console.error('Error updating todo:', err);
        res.status(400).json({ message: err.message });
    }
});

// Add a route to partially update a todo item
app.patch('/api/todos/:id', async (req, res) => {
    const updates = req.body;
    console.log('PATCH /api/todos/:id', req.params.id, req.body);

    try {
        const updatedTodo = await Todo.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true }
        );
        console.log('Todo partially updated:', updatedTodo);
        res.json(updatedTodo);
    } catch (err) {
        console.error('Error partially updating todo:', err);
        res.status(400).json({ message: err.message });
    }
});

// Add a route to delete a todo item
app.delete('/api/todos/:id', async (req, res) => {
    console.log('DELETE /api/todos/:id', req.params.id);
    console.log('Request received to delete todo:', req.params.id); // Added console log
    try {
        await Todo.findByIdAndDelete(req.params.id);
        console.log('Todo deleted:', req.params.id);
        res.json({ message: 'Todo deleted' });
    } catch (err) {
        console.error('Error deleting todo:', err);
        res.status(500).json({ message: err.message });
    }
});

// Add a route to initialize the database with sample data
app.post('/api/init', async (req, res) => {
    const sampleTodos = [
        { text: 'Sample Todo 1', completed: false },
        { text: 'Sample Todo 2', completed: true },
        { text: 'Sample Todo 3', completed: false }
    ];
    console.log('POST /api/init');

    try {
        await Todo.insertMany(sampleTodos);
        console.log('Sample data added');
        res.status(201).json({ message: 'Sample data added' });
    } catch (err) {
        console.error('Error adding sample data:', err);
        res.status(500).json({ message: err.message });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error stack:', err.stack);
    res.status(500).send('Something broke!');
});

app.listen(port, (err) => {
    if (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
    console.log(`Server is running on http://localhost:${port}`);
});