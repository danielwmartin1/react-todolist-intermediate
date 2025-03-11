/* eslint-env node */
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config(); // Ensure dotenv.config() is called first

if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined in the environment variables');
}

const app = express();
const port = 5001; // Changed port number

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://danielwmartin1:Mack2020!!@cluster0.ikgzxfz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const todoSchema = new mongoose.Schema({
  text: String,
  completed: Boolean,
});

const Todo = mongoose.model('Todo', todoSchema);

app.get('/todos', async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

app.post('/todos', async (req, res) => {
  const newTodo = new Todo({
    text: req.body.text,
    completed: false,
  });
  await newTodo.save();
  res.json(newTodo);
});

app.put('/todos/:id', async (req, res) => {
  const updatedTodo = await Todo.findByIdAndUpdate(
    req.params.id,
    { completed: req.body.completed },
    { new: true }
  );
  res.json(updatedTodo);
});

app.delete('/todos/:id', async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ message: 'Todo deleted' });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
