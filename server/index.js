const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Получение всех задач
app.get('/tasks', async (req, res) => {
  try {
    const allTasks = await pool.query('SELECT * FROM tasks');
    res.json(allTasks.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// Уведомление о запуске сервера
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});