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
    const allTasks = await pool.query('SELECT *, CASE WHEN is_completed THEN updated_at ELSE created_at END AS display_time FROM tasks ORDER BY is_completed, display_time DESC');
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
      let tasks = await pool.query('SELECT COUNT(*) FROM tasks WHERE title = $1', [title]);
      if (tasks.rows[0].count > 0) {
        alert('Задача с таким названием уже существует!');
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

// Удаление задачи
app.delete('/tasks/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
      res.json({ message: 'Task deleted' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
});

// Обновление статуса задачи
app.patch('/tasks/:id', async (req, res) => {
  try {
      const { id } = req.params;
      const { is_completed } = req.body;
      const updatedTask = await pool.query(
          'UPDATE tasks SET is_completed = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
          [is_completed, id]
      );
      res.json(updatedTask.rows[0]);
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
  }
});

// Отображение index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Сервер запущен: http://localhost:${PORT}`);
});