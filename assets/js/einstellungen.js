const {ipcRenderer} = require('electron')
const Store = require('electron-store')
const mlMath = require('ml-math')
const settingsStore = new Store()

function checkIfNumeric(min, sec) {
    let status = $("#status")
    if (!mlMath.numbers.isNumeric(min)) {
        if (mlMath.numbers.isNumeric(sec)) {
            min = 0
            $("#timeMin").val('0')
        } else {
            status.addClass('keinErfolg')
            status.html("Ungültige Zahl!")
            return false
        }
    }

    if (!mlMath.numbers.isNumeric(sec)) {
        if (mlMath.numbers.isNumeric(min)) {
            sec = 0
            $("#timeSec").val('0')
        } else {
            status.addClass('keinErfolg')
            status.html("Ungültige Zahl!")
            return false
        }
    }

    return true
}

function save() {
    let min = $("#timeMin").val()
    let sec = $("#timeSec").val()
    let status = $("#status")
    status.removeClass()
    status.addClass("animated bounceIn alert alert-primary")

    if (!checkIfNumeric(min, sec)) {
        return
    }

    status.addClass('erfolg')
    settingsStore.set('timeMin', min)
    settingsStore.set('timeSec', sec)

    status.html("Erfolgreich gespeichert.")
    ipcRenderer.send('settingsGespeichert')
}

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
    save()
})

$("#quickSelect").change(function () {
    const min = $("#quickSelect").val()
    $("#timeSec").val('')
    $("#timeMin").val(min)
    save()
})