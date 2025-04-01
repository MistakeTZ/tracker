async function fetchTasks() {
    const response = await fetch('http://localhost:5000/tasks');
    const tasks = await response.json();
    const tasksList = document.getElementById('tasks-list');
    
    tasks.forEach(task => {
      const taskElement = document.createElement('div');
      taskElement.textContent = task.title;
      tasksList.appendChild(taskElement);
    });
  }
  
  fetchTasks();