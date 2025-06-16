let totalTime = 25*60;
let timerInterval;
let isRunning = false;
let isBreakActive = false;

const countdown = document.getElementById("timer");

function updateDisplay() {
    let minutes = Math.floor(totalTime / 60);
    let seconds = totalTime % 60;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    countdown.innerText = `${minutes}:${seconds}`;
}

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        totalTime--; 
        updateDisplay(); 
        
        timerInterval = setInterval(() => {
            if (totalTime <= 0) {
                stopTimer();
                return;
            }
            totalTime--;
            updateDisplay();
        }, 1000);
        
        const startButton = document.getElementById('start');
        startButton.innerText = 'Stop';
        startButton.onclick = stopTimer;
    }
}

function stopTimer() {
    isRunning = false;
    clearInterval(timerInterval);
    
    const startButton = document.getElementById('start');
    startButton.innerText = 'Start';
    startButton.onclick = startTimer;
}
    

function resetTimer() {
    stopTimer();
    totalTime = 25*60;
    countdown.innerText = "25:00";
    isBreakActive = false;
    
    document.getElementById('gif-container').style.opacity = '0';
}

function setShortBreak() {
    stopTimer();
    updateDisplay();
    isBreakActive = true;
    
    document.getElementById('gif-container').style.opacity = '1';
}

function setLongBreak() {
    stopTimer();
    updateDisplay();
    isBreakActive = true;
    
    document.getElementById('gif-container').style.opacity = '1';
}

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];

function addTask() {
    const input = document.getElementById('task-input');
    const taskText = input.value.trim();
    
    if (taskText) {
        tasks.push({ text: taskText, completed: false });
        localStorage.setItem('tasks', JSON.stringify(tasks));
        updateTaskList();
        input.value = '';
    }
}

function toggleComplete(index) {
    tasks[index].completed = !tasks[index].completed;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    updateTaskList();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    updateTaskList();
}

function updateTaskList() {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';
    
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="${task.completed ? 'completed' : ''}">${task.text}</span>
            <div class="button-group">
                <button class="complete-btn" onclick="toggleComplete(${index})">
                    ${task.completed ? 'Undo' : 'Complete'}
                </button>
                <button class="delete-btn" onclick="deleteTask(${index})">Delete</button>
            </div>
        `;
        taskList.appendChild(li);
    });
}


document.addEventListener('DOMContentLoaded', () => {
    updateTaskList();
});



