import express from 'express';
import process from 'node:process';
import cors from 'cors'; // Import CORS middleware
import mongoose from 'mongoose'; // Import mongoose
import dotenv from 'dotenv';
import todosRoutes from './routes/todos.js'; // Update import for routes

dotenv.config(); // Load environment variables

const app = express();
const port = process.env.PORT || 5001;

// MongoDB connection setup
const mongoURI = /*process.env.MONGO_URI ||*/ 'mongodb://localhost:27017/todo-app';
console.log(`Connecting to MongoDB at: ${mongoURI}`); // Log the MongoDB URI
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware setup
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies

// Routes
app.use('/api/todos', todosRoutes); // Use imported routes

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