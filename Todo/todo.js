let tasks = [];
let filter = 'all';

const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const headerTitle = document.getElementById('headerTitle');
const headerDate = document.getElementById('headerDate');
const filterButtons = Array.from(document.querySelectorAll('.filter'));
const slider = document.querySelector('.filter-slider');

const d = new Date();
headerDate.textContent = `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`;

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

    taskDiv.innerHTML = `
      <div class="task-content">
        <span>${task.text}</span>
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

function addTask() {
  const text = taskInput.value.trim();

  if (!text) return;

  tasks.push({
    id: Date.now(),
    text,
    done: false,
  });

  taskInput.value = '';
  render();
}

function toggleTask(id) {
  const task = tasks.find((item) => item.id === id);

  if (task) {
    task.done = !task.done;
    render();
  }
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  render();
}

function setFilter(nextFilter) {
  filter = nextFilter;
  render();
}

addBtn.addEventListener('click', addTask);

taskInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    addTask();
  }
});

filterButtons.forEach((button) => {
  button.addEventListener('click', () => setFilter(button.textContent.split(' ')[0].toLowerCase()));
});

render();