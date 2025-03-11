import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
const port = 5001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
dotenv.config();

const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
import todosRoutes from './routes/todos';
import dotenv from 'dotenv';
app.use('/todos', todosRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});