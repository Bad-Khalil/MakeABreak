const Timer = require('tiny-timer')
const roundTo = require('round-to');
const Store = require('electron-store')
const {numbers} = require('ml-math')
const settingsStore = new Store()

const btnStartValue = "<i class='fas fa-rocket'></i>"
const btnPauseValue = "<i class='fas fa-pause'></i>"
let timer = new Timer()
var zeit

init()

// -------------- Hilfsfunktionen --------------
/**
 * Initialisiert:
 * Liest Settings aus und setzt den Text
 */
function init() {
    getTimeFromSettings()
    $("#maxTimer").html("Pause nach " + roundTo((zeit / 1000) / 60, 1) + " Minuten")
}

/**
 * Liest die Zeiteinstellungen aus den Einstellungen aus
 */
function getTimeFromSettings() {
    let timeMin = settingsStore.get('timeMin')
    let timeSec = settingsStore.get('timeSec')
    zeit = timeMin * 60 * 1000
    zeit += timeSec * 1000

    if (!numbers.isNumeric(zeit)) {
        zeit = 1800000
    }
}

/**
 * Rechnet anhand der Millisekunden die Prozentanzahl aus
 * Ist für die Progressbar
 * @param {*} ms 
 */
function getPercent(ms) {
    return (zeit - ms) / (zeit / 100)
}

function minimieren() {

    if (settingsStore.get('minimieren') === 'x') {
        remote.BrowserWindow.getFocusedWindow().minimize();
    }
}

// -------------- Buttons --------------
$("#timerStart").click(function () {
    
    let btn = $("#timerStart")
    $("#startImg").addClass('invisible')

    if (timer.status == 'running') {
        btn.html(btnStartValue)
        timer.pause()
    } else if (timer.status == 'paused') {
        btn.html(btnPauseValue)
        timer.resume()
        minimieren()
    } else {
        btn.html(btnPauseValue)
        timer.start(zeit)
        $("#barContainer").removeClass()
        $("#barContainer").addClass('animated fadeIn animated-box in')
        minimieren()
    }
})

$("#beenden").click(function () {
    timer.stop()
    $("#progressbarInner").width("0%")
    $("#timerStart").html(btnStartValue)
    $("#barContainer").removeClass()
    $("#barContainer").addClass('animated fadeOut')

    setTimeout(function () {
        $("#barContainer").removeClass()
        $("#barContainer").addClass('invisible')
        $("#startImg").removeClass()
        $("#startImg").addClass('animated fadeIn')
    }, 1000);
})

// -------------- TIMER  --------------

/**
 * Führt alles aus, während der Timer läuft
 * @param {*} ms 
 */
function tick(ms) {
    let pauseInSec = roundTo(ms / 1000, 0)
    let pauseInMin = roundTo(pauseInSec / 60, 1)
    let minutenString = "Minuten"

    if (roundTo(pauseInMin, 1) == 1) {
        minutenString = "Minute"
    }

    $("#progressbarInner").width(getPercent(ms) + "%")
    $("#pauseIn").html("Pause in " + pauseInMin + " " + minutenString)
}

timer.on('tick', (ms) => {
    tick(ms)
})

timer.on('statusChanged', (ms) => {})

timer.on('done', (ms) => {
    ipcRenderer.send('timeOver')
    $("#pauseIn").html("100%")
    $("#timerStart").html(btnStartValue)
})