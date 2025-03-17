import express from 'express';
import process from 'node:process';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import todosRoutes from './routes/todos.js';
import Todo from './models/todo.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

// MongoDB connection setup
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/todo-app';
console.log(`Connecting to MongoDB at: ${mongoURI}`);
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
    initializeCollection();
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware setup
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/todos', todosRoutes);

// Example route to test server
app.get('/api/test', (req, res) => {
  console.log('GET /api/test');
  res.send('Server is running');
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

// Function to initialize the collection with default data
async function initializeCollection() {
  try {
    const count = await Todo.countDocuments();
    if (count === 0) {
      const defaultTodos = [
        { text: 'Sample Todo 1', completed: false },
        { text: 'Sample Todo 2', completed: true },
      ];
      await Todo.insertMany(defaultTodos);
      console.log('Default todos added to the collection');
    }
  } catch (error) {
    console.error('Error initializing collection:', error);
  }
}