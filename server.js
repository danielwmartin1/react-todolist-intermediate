import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
const port = 5001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const mongoURI = 'mongodb+srv://danielwmartin1:Mack2020!!@cluster0.ikgzxfz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
import todosRoutes from './routes/todos';
app.use('/todos', todosRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});