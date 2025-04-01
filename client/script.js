document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.querySelector('.task-input');
    const addBtn = document.querySelector('.add-btn');
    const tasksList = document.querySelector('.tasks-list');

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addBtn.click();
      });
  
    // Загрузка задач при старте
    loadTasks();
  
    // Обработчик добавления задачи
    addBtn.addEventListener('click', async () => {
      const title = taskInput.value.trim();
      if (title) {
        await addTask(title);
        taskInput.value = '';
        loadTasks();
      }
    });
  
    // Функция загрузки задач
    async function loadTasks() {
      try {
        const response = await fetch('http://localhost:5000/tasks');
        const tasks = await response.json();
        renderTasks(tasks);
      } catch (error) {
        console.error('Ошибка загрузки задач:', error);
      }
    }
  
    // Функция добавления задачи
    async function addTask(title) {
      try {
        await fetch('http://localhost:5000/new_task', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title })
        });
      } catch (error) {
        console.error('Ошибка добавления задачи:', error);
      }
    }
  
    // Отрисовка задач
    function renderTasks(tasks) {
      tasksList.innerHTML = tasks.map(task => `
        <li class="task-item">
          <span>${task.title}</span>
          <button data-id="${task.id}">Удалить</button>
        </li>
      `).join('');
    }
  });