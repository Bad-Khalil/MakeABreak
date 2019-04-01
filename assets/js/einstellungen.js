const {
    ipcRenderer
} = require('electron')
const Store = require('electron-store')
const settingsStore = new Store()
const isNumber = require('is-number')

$(function () {
    let timeMin = settingsStore.get('timeMin')
    let timeSec = settingsStore.get('timeSec')

    $("#timeMin").val(timeMin)
    $("#timeSec").val(timeSec)
})

$("#timeMin").change(function () {
    $("#status").removeClass('erfolg keinErfolg status')
    $("#status").html("Setze hier deine Werte.")
})

$("#btnSpeichern").click(function () {
    let min = $("#timeMin").val()
    let sec = $("#timeSec").val()
    let status = $("#status")
    status.addClass("status")

    if (!isNumber(min) || !isNumber(sec)) {
        status.addClass('keinErfolg')
        status.html("Ungültige Zahl!")
        return;
    }

    status.addClass('erfolg')
    settingsStore.set('timeMin', min)
    settingsStore.set('timeSec', sec)

    status.html("Erfolgreich gespeichert.")
    ipcRenderer.send('settingsGespeichert')
})