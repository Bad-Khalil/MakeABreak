const Timer   = require('tiny-timer');
const roundTo = require('round-to');
const Store   = require('electron-store');
const settingsStore = new Store();
const {numbers}  = require('ml-math');
const { remote } = require('electron');

const btnStartValue = "<i class='fas fa-rocket'></i>";
const btnPauseValue = "<i class='fas fa-pause'></i>";
let timer = new Timer();
var zeit;

init();

// -------------- Helper functions --------------
/**
 * Initializes:
 * Gets Settings and sets the text
 */
function init() {
    getTimeFromSettings();
    $("#maxTimer").html("Break after " + roundTo((zeit / 1000) / 60, 1) + " minutes")
}

/**
 * Reads the time settings from the settings
 */
function getTimeFromSettings() {
    let timeMin = settingsStore.get('timeMin');
    let timeSec = settingsStore.get('timeSec');
    zeit = timeMin * 60 * 1000;
    zeit += timeSec * 1000;

    if (!numbers.isNumeric(zeit)) {
        zeit = 1800000
    }
}

/**
 * Calculates the percentage number based on the milliseconds
 * Is used for the Progressbar
 * @param {*} ms
 */
function getPercent(ms) {
    return (zeit - ms) / (zeit / 100)
}

function minimize() {

    if (settingsStore.get('minimize') === 'x') {
        remote.BrowserWindow.getFocusedWindow().minimize();
    }
}

// -------------- Buttons --------------
$("#timerStart").click(function () {

    let btn = $("#timerStart");
    $("#startImg").addClass('invisible');

    if (timer.status === 'running') {
        btn.html(btnStartValue);
        timer.pause()
    } else if (timer.status === 'paused') {
        btn.html(btnPauseValue);
        timer.resume();
        minimize()
    } else {
        btn.html(btnPauseValue);
        timer.start(zeit);
        $("#barContainer").removeClass();
        $("#barContainer").addClass('animated fadeIn animated-box in');
        minimize()
    }
});

$("#beenden").click(function () {
    timer.stop();
    $("#progressbarInner").width("0%");
    $("#timerStart").html(btnStartValue);
    $("#barContainer").removeClass();
    $("#barContainer").addClass('animated fadeOut');

    setTimeout(function () {
        $("#barContainer").removeClass();
        $("#barContainer").addClass('invisible');
        $("#startImg").removeClass();
        $("#startImg").addClass('animated fadeIn')
    }, 1000);
});

// -------------- TIMER  --------------
/**
 * Executes everything while the timer is running
 * @param {*} ms
 */
function tick(ms) {
    let pauseInSec = roundTo(ms / 1000, 0);
    let pauseInMin = roundTo(pauseInSec / 60, 1);
    let minutenString = "minutes";

    if (roundTo(pauseInMin, 1) === 1) {
        minutenString = "minute"
    }

    $("#progressbarInner").width(getPercent(ms) + "%");
    $("#pauseIn").html("Break in " + pauseInMin + " " + minutenString)
}

timer.on('tick', (ms) => {
    tick(ms)
});

timer.on('done', (ms) => {
    ipcRenderer.send('timeOver');
    $("#pauseIn").html("100%");
    $("#timerStart").html(btnStartValue)
});