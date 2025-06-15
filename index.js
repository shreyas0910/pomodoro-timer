let totalTime = 25*60;
let timerInterval;
let isRunning = false;

const countdown = document.getElementById("timer");

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        timerInterval = setInterval(() => {
            let minutes = Math.floor(totalTime / 60);
            let seconds = totalTime % 60;
            seconds = seconds < 10 ? "0" + seconds : seconds;
            minutes = minutes < 10 ? "0" + minutes : minutes;
            countdown.innerText = `${minutes}:${seconds}`;
            
            if (totalTime <= 0) {
                stopTimer();
                return;
            }
            totalTime--;
        }, 1000);
    }
}

function stopTimer() {
    isRunning = false;
    clearInterval(timerInterval);
}

function resetTimer() {
    stopTimer();
    totalTime = 25*60;
    countdown.innerText = "25:00";
}


