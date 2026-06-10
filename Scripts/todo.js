let tasks = [];
let filter = 'all';

const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

const taskInput = document.getElementById('taskInput');
const deadlineInput = document.getElementById('deadlineInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const headerTitle = document.getElementById('headerTitle');
const taskCountLabel = document.getElementById('taskCount');
const headerDate = document.getElementById('headerDate');
const filterButtons = Array.from(document.querySelectorAll('.filter'));
const slider = document.querySelector('.filter-slider');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');
const alertedOverdueTaskIds = new Set();

const d = new Date();
headerDate.textContent = `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`;

const savedUser = JSON.parse(localStorage.getItem('user') || 'null')
const userNameSpan = document.querySelector('.user span')
if (savedUser && userNameSpan) {
  userNameSpan.textContent = savedUser.name || savedUser.email || 'User'
}

const logoutBtn = document.getElementById('logoutBtn')
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('user')
    window.location.href = './todo-login.html'
  })
}

async function loadTasks() {
  if (!savedUser) return

  const response = await fetch(`/tasks?user_id=${savedUser.user_id}`)
  if (response.ok) {
    const serverTasks = await response.json()
    tasks = serverTasks.map((task) => ({
      id: task.task_id,
      text: task.task,
      deadline: task.deadline || '',
      done: !!task.completed,
      task_id: task.task_id,
      completed: !!task.completed,
    }))
  } else {
    tasks = []
  }

  render()
}

function getVisibleTasks() {
  if (filter === 'active') {
    return tasks.filter((task) => !task.done);
  }

  if (filter === 'completed') {
    return tasks.filter((task) => task.done);
  }

  return tasks;
}

function updateFilterButtons() {
  filterButtons.forEach((button) => {
    const buttonFilter = button.textContent.split(' ')[0].toLowerCase();

    button.classList.remove('active-filter');

    if (buttonFilter === filter) {
      button.classList.add('active-filter');
    }
  });

  if (!slider) return;

  const activeIndex = filterButtons.findIndex((button) => button.textContent.split(' ')[0].toLowerCase() === filter);
  const slotWidth = filterButtons[0].offsetWidth;

  slider.style.transform = `translateX(${activeIndex * slotWidth}px)`;
  slider.style.width = `${slotWidth}px`;
}

function updateFilterCounts(totalTasks, activeTasks, completedTasks) {
  filterButtons[0].textContent = `All ${totalTasks}`;
  filterButtons[1].textContent = `Active ${activeTasks}`;
  filterButtons[2].textContent = `Completed ${completedTasks}`;
}

function render() {
  const visibleTasks = getVisibleTasks();
  const totalTasks = tasks.length;
  const activeTasks = tasks.filter((task) => !task.done).length;
  const completedTasks = tasks.filter((task) => task.done).length;

  updateFilterCounts(totalTasks, activeTasks, completedTasks);
  headerTitle.textContent = `${activeTasks} tasks left.`;
  taskCountLabel.textContent = `${totalTasks} tasks added`;
  clearCompletedBtn.style.display = completedTasks > 0 ? 'inline-flex' : 'none';

  const overdueTasks = tasks.filter((task) => task.deadline && !task.done && getDeadlineStatus(task.deadline) === 'overdue');
  const newOverdueTasks = overdueTasks.filter((task) => !alertedOverdueTaskIds.has(task.id));

  if (newOverdueTasks.length > 0) {
    newOverdueTasks.forEach((task) => alertedOverdueTaskIds.add(task.id));
    const names = newOverdueTasks.map((task) => `- ${task.text}`).join('\n');
    alert(`Overdue task${newOverdueTasks.length > 1 ? 's' : ''}:\n${names}`);
  }

  taskList.innerHTML = '';

  if (totalTasks === 0) {
    taskList.innerHTML = `
      <div class="circle">
        <div class="inner-circle"></div>
      </div>
      <p>Add your first task above</p>
    `;

    updateFilterButtons();
    return;
  }

  if (visibleTasks.length === 0) {
    taskList.innerHTML = `
      <div class="circle">
        <div class="inner-circle"></div>
      </div>
      <p>No ${filter} tasks</p>
    `;

    updateFilterButtons();
    return;
  }

  visibleTasks.forEach((task) => {
    const taskDiv = document.createElement('div');
    taskDiv.classList.add('task');

    if (task.done) {
      taskDiv.classList.add('done');
    }

    const deadlineStatus = task.deadline ? getDeadlineStatus(task.deadline) : '';
    if (!task.done && (deadlineStatus === 'today' || deadlineStatus === 'tomorrow')) {
      taskDiv.classList.add('due-soon');
    }

    const deadlineText = task.deadline ? formatDeadline(task.deadline) : '';
    const overdueBadge = deadlineStatus === 'overdue' && !task.done ? `<span class="task-overdue">Overdue</span>` : '';

    taskDiv.innerHTML = `
      <div class="task-content">
        <span class="task-text">${task.text}</span>
        ${task.deadline ? `<span class="task-deadline"><i class="fa-regular fa-calendar-days"></i> ${deadlineText}</span>` : ''}
        ${overdueBadge}
      </div>
      <div class="task-actions">
        <button class="toggle-btn" type="button">${task.done ? 'Undo' : 'Done'}</button>
        <button class="delete-btn" type="button">Delete</button>
      </div>
    `;

    taskDiv.querySelector('.toggle-btn').addEventListener('click', () => toggleTask(task.id));
    taskDiv.querySelector('.delete-btn').addEventListener('click', () => deleteTask(task.id));
    taskList.appendChild(taskDiv);
  });

  updateFilterButtons();
}

function getDeadlineStatus(dateString) {
  const target = new Date(dateString);
  target.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffDays = Math.round((target.getTime() - today.getTime()) / 86400000);

  if (diffDays < 0) return 'overdue';
  if (diffDays === 0) return 'today';
  if (diffDays === 1) return 'tomorrow';
  return 'future';
}

function formatDeadline(dateString) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const status = getDeadlineStatus(dateString);

  if (status === 'today') return 'Today';
  if (status === 'tomorrow') return 'Tomorrow';
  if (status === 'overdue') return `Overdue (${months[date.getMonth()]} ${date.getDate()})`;
  return `${months[date.getMonth()]} ${date.getDate()}`;
}

async function addTask() {
  const text = taskInput.value.trim();
  const rawDeadline = deadlineInput.value;

  if (!text || !savedUser) return;

  const response = await fetch('/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id: savedUser.user_id,
      task: text,
      deadline: rawDeadline || null,
    }),
  })

  if (!response.ok) {
    alert('Unable to save task to the server.')
    return
  }

  taskInput.value = '';
  deadlineInput.value = '';
  await loadTasks();
}

async function toggleTask(id) {
  const task = tasks.find((item) => item.id === id);

  if (!task) return;

  const response = await fetch(`/tasks/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ done: !task.done }),
  })

  if (response.ok) {
    await loadTasks();
  }
}

async function deleteTask(id) {
  const response = await fetch(`/tasks/${id}`, {
    method: 'DELETE',
  })

  if (response.ok) {
    await loadTasks();
  }
}

async function clearCompletedTasks() {
  if (!savedUser) return;

  const response = await fetch(`/tasks?user_id=${savedUser.user_id}`, {
    method: 'DELETE',
  })

  if (response.ok) {
    await loadTasks();
  }
}

function setFilter(nextFilter) {
  filter = nextFilter;
  render();
}

addBtn.addEventListener('click', addTask);
clearCompletedBtn.addEventListener('click', clearCompletedTasks);

taskInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    addTask();
  }
});

filterButtons.forEach((button) => {
  button.addEventListener('click', () => setFilter(button.textContent.split(' ')[0].toLowerCase()));
});

loadTasks();