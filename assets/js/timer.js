const Timer   = require('tiny-timer')
const roundTo = require('round-to');
const Store   = require('electron-store')
const settingsStore = new Store()

let timer = new Timer()
var zeit

init()

function init(){
    getTimeFromSettings()
    $("#maxTimer").html("Pause nach " + roundTo((zeit / 1000) / 60, 1) + " Minuten")
}

function getTimeFromSettings() {
    let timeMin = settingsStore.get('timeMin')
    let timeSec = settingsStore.get('timeSec')
    zeit = timeMin * 60 * 1000
    zeit += timeSec * 1000

    if (zeit === '') {
        zeit = 10000
    }
}

$("#timerStart").click(function () {
    let btn = $("#timerStart")

    if (timer.status == 'running') {
        btn.html("Weiter")
        timer.pause()
    } else if (timer.status == 'paused') {
        btn.html("Pause")
        timer.resume()
    } else {
        btn.html("Pause")
        timer.start(zeit)
        $("#barContainer").removeClass('invisible')
    }
})

$("#maxTimer").html("Pause nach " + roundTo((zeit / 1000) / 60, 1) + " Minuten")

/**
 * Rechnet anhand der Millisekunden die Prozentanzahl aus
 * Ist für die Progressbar
 * @param {*} ms 
 */
function getPercent(ms) {
    return (zeit - ms) / (zeit / 100)
}

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
    $("#timerStart").html("Start")
})