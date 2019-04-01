const Timer = require('tiny-timer')
const roundTo = require('round-to');

let timer = new Timer()
let zeit = 50000

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

$("#maxTimer").html("Zeiteinstellung: " + zeit / 1000 + " Sekunden")

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
    let pauseInMin = roundTo(pauseInSec / 60, 0)

    $("#progressbarInner").width(getPercent(ms) + "%")
    $("#pauseIn").html("Pause in " + pauseInSec + " Sekunden | " + pauseInMin + " Minuten")
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