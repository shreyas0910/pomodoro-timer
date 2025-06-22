let totalTime = 25 * 60;
let timerInterval;
let isRunning = false;
let endTime = null;

const countdown = document.getElementById("timer");
const gifContainer = document.getElementById('gif-container');
const timerSound = new Audio('./sounds/timer-end.mp3');

function updateDisplay() {
    let displayTime = totalTime;
    if (isRunning && endTime) {
        const now = Date.now();
        displayTime = Math.max(0, Math.round((endTime - now) / 1000));
    }
    let hours = Math.floor(displayTime / 3600);
    let minutes = Math.floor((displayTime % 3600) / 60);
    let seconds = displayTime % 60;

    seconds = seconds < 10 ? "0" + seconds : seconds;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    hours = hours < 10 ? "0" + hours : hours;

    countdown.innerText = hours > 0 ?
        `${hours}:${minutes}:${seconds}` :
        `${minutes}:${seconds}`;
}

function setShortBreak() {
    stopTimer();
    updateDisplay();

    // Show first GIF (Locked In)
    document.querySelector('#gif-container img:first-child').style.display = 'block';
    document.querySelector('#gif-container img:last-child').style.display = 'none';
    document.getElementById('gif-container').style.opacity = '1';
    document.getElementById('gif-container').style.display = 'block';
}

function setLongBreak() {
    stopTimer();
    updateDisplay();

    // Show first GIF (Locked In)
    document.querySelector('#gif-container img:first-child').style.display = 'block';
    document.querySelector('#gif-container img:last-child').style.display = 'none';
    document.getElementById('gif-container').style.opacity = '1';
    document.getElementById('gif-container').style.display = 'block';
}

function showEndGif() {
    // Show second GIF (Timer Complete)
    document.querySelector('#gif-container img:first-child').style.display = 'none';
    document.querySelector('#gif-container img:last-child').style.display = 'block';
    document.getElementById('gif-container').style.opacity = '1';
    document.getElementById('gif-container').style.display = 'block';
}

function loadYouTubeAPI() {
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

function onYouTubeIframeAPIReady() {
    player = new YT.Player('youtube-player', {
        height: '0',
        width: '0',
        videoId: '8UpGNI1zzAM',
        playerVars: {
            'autoplay': 0,
            'controls': 0,
            'disablekb': 1,
            'fs': 0
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    isYouTubeReady = true;
    // Preload the video
    player.playVideo();
    player.pauseVideo();
    player.seekTo(0);
}

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.ENDED) {
        player.seekTo(0);
    }
}

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        // Set the end time based on current time and totalTime
        endTime = Date.now() + totalTime * 1000;
        updateDisplay();

        timerInterval = setInterval(() => {
            const now = Date.now();
            let remaining = Math.max(0, Math.round((endTime - now) / 1000));
            if (remaining <= 0) {
                stopTimer();
                timerSound.play();
                showEndGif();
                totalTime = 0;
                updateDisplay();
                return;
            }
            totalTime = remaining;
            updateDisplay();
        }, 250);

        const startButton = document.getElementById('start');
        startButton.innerText = 'Stop';
        startButton.onclick = stopTimer;
    }
}

function stopTimer() {
    isRunning = false;
    clearInterval(timerInterval);
    endTime = null;

    const startButton = document.getElementById('start');
    startButton.innerText = 'Start';
    startButton.onclick = startTimer;
}


function resetTimer() {
    stopTimer();
    totalTime = 25*60;
    countdown.innerText = "25:00";
    // Hide GIF container when resetting
    document.getElementById('gif-container').style.opacity = '0';
    document.getElementById('gif-container').style.display = 'none';
}

function addTimeControls() {
    const controls = document.createElement('div');
    controls.innerHTML = `
        <div id="time-controls">
            <input type="number" id="hours-input" min="0" max="24" value="0">
            <label for="hours-input">hours</label>
            <input type="number" id="minutes-input" min="0" max="59" value="25">
            <label for="minutes-input">minutes</label>
            <input type="number" id="seconds-input" min="0" max="59" value="0">
            <label for="seconds-input">seconds</label>
            <button onclick="setCustomTime()">Set Time</button>
        </div>
    `;
    document.getElementById('timer').insertAdjacentElement('afterend', controls);
}

function setCustomTime() {
    const hours = parseInt(document.getElementById('hours-input').value) || 0;
    const minutes = parseInt(document.getElementById('minutes-input').value) || 0;
    const seconds = parseInt(document.getElementById('seconds-input').value) || 0;

    const totalSeconds = (hours * 3600) + (minutes * 60) + seconds;

    if (totalSeconds > 0) {
        stopTimer();
        totalTime = totalSeconds;
        updateDisplay();
    }
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

    // Sort tasks: incomplete first, then completed
    const sortedTasks = [...tasks].sort((a, b) => {
        if (a.completed === b.completed) return 0;
        return a.completed ? 1 : -1;
    });

    sortedTasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="${task.completed ? 'completed' : ''}">${task.text}</span>
            <div class="button-group">
                <button class="complete-btn" onclick="toggleComplete(${tasks.indexOf(task)})">
                    ${task.completed ? 'Undo' : 'Complete'}
                </button>
                <button class="delete-btn" onclick="deleteTask(${tasks.indexOf(task)})">Delete</button>
            </div>
        `;
        taskList.appendChild(li);
    });
}


document.addEventListener('DOMContentLoaded', () => {
    updateTaskList();
    addTimeControls();
    loadYouTubeAPI();
});



