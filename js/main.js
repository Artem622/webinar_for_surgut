document.addEventListener('DOMContentLoaded', function() {
    loadTasks();
    updateClock();
    setInterval(updateClock, 1000);
});

function addTask() {
    const taskName = document.getElementById('taskName').value;
    const taskDescription = document.getElementById('taskDescription').value;

    const task = {
        name: taskName,
        description: taskDescription,
        timer: 0,
        completed: false,
        timerInterval: null
    };

    tasks.push(task);
    updateTaskList();

    document.getElementById('taskForm').reset();
}

function startTimer(index) {
    const task = tasks[index];


    if (!task.timerInterval) {
        task.timerInterval = setInterval(() => {
            task.timer += 1;
            updateTaskList();
        }, 1000);


        const startButton = document.querySelector(`#taskList .task:nth-child(${index + 1}) button:nth-child(1)`);
        startButton.disabled = true;
    }
}

function markCompleted(index) {
    const task = tasks[index];
    task.completed = true;
    clearInterval(task.timerInterval);
    updateTaskList();
}

function deleteTask(index) {
    const task = tasks[index];
    clearInterval(task.timerInterval);
    tasks.splice(index, 1);
    updateTaskList();
}

function updateTaskList() {
    const taskListContainer = document.getElementById('taskList');
    taskListContainer.innerHTML = '';

    tasks.forEach((task, index) => {
        const taskElement = document.createElement('div');
        taskElement.classList.add('task');

        const taskInfo = document.createElement('div');
        taskInfo.innerHTML = `<strong>${task.name}</strong><p>${task.description}</p>`;

        const taskActions = document.createElement('div');

        if (!task.completed) {
            taskActions.innerHTML += `<button onclick="startTimer(${index})" ${task.timerInterval ? 'disabled' : ''}>Старт</button>`;
        }

        taskActions.innerHTML += `<p>Время: ${formatTime(task.timer)}</p>`;
        taskActions.innerHTML += `<button  onclick="markCompleted(${index})">Выполнено</button>`;
        taskActions.innerHTML += `<button class="btn" onclick="deleteTask(${index})">Удалить</button>`;

        taskElement.appendChild(taskInfo);
        taskElement.appendChild(taskActions);

        taskListContainer.appendChild(taskElement);
    });

    saveTasks();
}

function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${pad(hours)}:${pad(minutes)}:${pad(remainingSeconds)}`;
}

function pad(number) {
    return number < 10 ? '0' + number : number;
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const storedTasks = localStorage.getItem('tasks');

    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
        updateTaskList();
    }
}

function updateClock() {
    const clockElement = document.getElementById('clock');
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    clockElement.textContent = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

let tasks = [];
