let workTime = 25 * 60; // 25 menit kerja
let breakTime = 5 * 60; // 5 menit istirahat
let currentTime = workTime;
let isRunning = false;
let isWork = true;
let expectedEndTime = null;
let uiInterval = null;
let endTimeout = null;

const timerDisplay = document.getElementById("timer");
const modeDisplay = document.getElementById("mode");
const beepSound = document.getElementById("beep");

function requestNotificationPermission() {
    if ("Notification" in window && Notification.permission !== "granted") {
        Notification.requestPermission();
    }
}

function sendNotification(message) {
    if ("Notification" in window && Notification.permission === "granted") {
        new Notification("⏰ Pomodoro Timer", { body: message });
    }
}

function updateDisplay() {
    let remaining = Math.max(0, Math.floor((expectedEndTime - Date.now()) / 1000));
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    modeDisplay.textContent = isWork ? "Work Mode" : "Break Mode";
}

function onFinish() {
    isRunning = false;
    beepSound.play();
    sendNotification(isWork ? "Waktu kerja selesai! Saatnya istirahat." : "Waktu istirahat selesai! Saatnya kerja.");
    isWork = !isWork;
    currentTime = isWork ? workTime : breakTime;
    startTimer(); 
}

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        currentTime = currentTime > 0 ? currentTime : (isWork ? workTime : breakTime);
        expectedEndTime = Date.now() + currentTime * 1000;
        uiInterval = setInterval(updateDisplay, 1000);
        endTimeout = setTimeout(onFinish, currentTime * 1000);
    }
}

function pauseTimer() {
    if (isRunning) {
        clearInterval(uiInterval);
        clearTimeout(endTimeout);
        currentTime = Math.max(0, Math.floor((expectedEndTime - Date.now()) / 1000));
        isRunning = false;
    }
}

function resetTimer() {
    clearInterval(uiInterval);
    clearTimeout(endTimeout);
    isRunning = false;
    currentTime = isWork ? workTime : breakTime;
    expectedEndTime = null;
    updateDisplay();
}

requestNotificationPermission();
updateDisplay();