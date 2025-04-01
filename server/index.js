const express = require('express');
const cors = require('cors');
const path = require('path');
const pool = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Раздача статических файлов из папки client
app.use(express.static(path.join(__dirname, '../client')));

// Получение всех задач
app.get('/tasks', async (req, res) => {
  try {
    const allTasks = await pool.query('SELECT * FROM tasks');
    res.json(allTasks.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Добавление новой задачи
app.post('/new_task', async (req, res) => {
    try {
      const { title } = req.body;
      if (!title) {
        alert('Введите текст задачи!');
        return;
      }
      const newTask = await pool.query(
        'INSERT INTO tasks (title) VALUES($1) RETURNING *',
        [title]
      );
      res.json(newTask.rows[0]);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

// Все остальные GET-запросы → index.html (SPA fallback)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Сервер запущен: http://localhost:${PORT}`);
});