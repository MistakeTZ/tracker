document.addEventListener('DOMContentLoaded', () => {
  const serverAddress = "http://localhost:5000/";

  const taskInput = document.querySelector('.task-input');
  const addBtn = document.querySelector('.add-btn');
  const tasksList = document.querySelector('.tasks-list');
  const completedTasksList = document.querySelector('.completed-tasks-list');

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
          const response = await fetch(serverAddress + 'tasks');
          const tasks = await response.json();
          renderTasks(tasks);
      } catch (error) {
          console.error('Ошибка загрузки задач:', error);
      }
  }

  // Функция добавления задачи
  async function addTask(title) {
      try {
          await fetch(serverAddress + 'new_task', {
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
      // Очищаем списки
      tasksList.innerHTML = '';
      completedTasksList.innerHTML = '';

      // Разделяем задачи на активные и выполненные
      const activeTasks = tasks.filter(task => !task.is_completed);
      const completedTasks = tasks.filter(task => task.is_completed);

      // Рендерим активные задачи
      activeTasks.forEach(task => {
          const taskItem = createTaskElement(task);
          tasksList.appendChild(taskItem);
      });

      // Рендерим выполненные задачи
      completedTasks.forEach(task => {
          const taskItem = createTaskElement(task);
          completedTasksList.appendChild(taskItem);
      });

      // Навешиваем обработчики удаления
      document.querySelectorAll('.delete-btn').forEach(btn => {
          btn.addEventListener('click', async () => {
              const taskId = btn.dataset.id;
              await deleteTask(taskId);
              loadTasks();
          });
      });

      // Навешиваем обработчики чекбоксов
      document.querySelectorAll('.completed-checkbox').forEach(checkbox => {
          checkbox.addEventListener('change', async (e) => {
              const taskId = e.target.dataset.id;
              const isCompleted = e.target.checked;
              await updateTaskStatus(taskId, isCompleted);
              loadTasks();
          });
      });
  }

  // Создание элемента задачи
  function createTaskElement(task) {
    const taskItem = document.createElement('li');
    taskItem.className = `task-item ${task.is_completed ? 'completed' : ''}`;
    
    // Форматируем дату
    const timeText = task.is_completed 
        ? `Выполнено: ${formatDate(task.completed_at || task.updated_at)}`
        : `Создано: ${formatDate(task.created_at)}`;
    
    taskItem.innerHTML = `
        <div>
            <input type="checkbox" class="completed-checkbox" 
                   data-id="${task.id}" ${task.is_completed ? 'checked' : ''}>
            <span>${task.title}</span>
            <div class="task-time">${timeText}</div>
        </div>
        <button class="delete-btn" data-id="${task.id}">Удалить</button>
    `;
    
    return taskItem;
  }

  // Функция для форматирования даты
  function formatDate(dateString) {
      if (!dateString) return 'неизвестно';
      
      const date = new Date(dateString);
      return date.toLocaleString('ru-RU', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
      });
  }

  // Функция для удаления задачи
  async function deleteTask(taskId) {
      try {
          await fetch(serverAddress + `tasks/${taskId}`, {
              method: 'DELETE'
          });
      } catch (error) {
          console.error('Ошибка удаления задачи:', error);
      }
  }

  // Новая функция для обновления статуса задачи
  async function updateTaskStatus(taskId, isCompleted) {
      try {
          await fetch(serverAddress + `tasks/${taskId}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ is_completed: isCompleted })
          });
      } catch (error) {
          console.error('Ошибка обновления задачи:', error);
      }
  }
});