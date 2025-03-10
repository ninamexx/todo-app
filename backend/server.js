const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

let tasks = [];

// Get all tasks with pagination, sorting, and searching
app.get('/api/tasks', (req, res) => {
  const { page = 1, limit = 5, sort = 'title', search = '' } = req.query;

  let filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(search.toLowerCase()) ||
    task.description.toLowerCase().includes(search.toLowerCase())
  );

  filteredTasks.sort((a, b) => {
    if (sort === 'title') {
      return a.title.localeCompare(b.title);
    } else {
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
  });

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedTasks = filteredTasks.slice(startIndex, endIndex);

  res.json({
    total: filteredTasks.length,
    page: parseInt(page),
    limit: parseInt(limit),
    tasks: paginatedTasks,
  });
});

// Get a single task by ID (not used in the frontend)
app.get('/api/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === req.params.id);
  if (task) {
    res.json(task);
  } else {
    res.status(404).json({ message: 'Task not found' });
  }
});

// Create a new task
app.post('/api/tasks', (req, res) => {
  const newTask = { id: uuidv4(), priority: 'low', ...req.body };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// Update a task
app.put('/api/tasks/:id', (req, res) => {
  const index = tasks.findIndex(t => t.id === req.params.id);
  if (index !== -1) {
    tasks[index] = { ...tasks[index], priority: 'low', ...req.body };
    res.json(tasks[index]);
  } else {
    res.status(404).json({ message: 'Task not found' });
  }
});

// Delete a task
app.delete('/api/tasks/:id', (req, res) => {
  tasks = tasks.filter(t => t.id !== req.params.id);
  res.status(204).end();
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});