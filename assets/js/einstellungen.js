const {
    ipcRenderer
} = require('electron')
const Store = require('electron-store')
const settingsStore = new Store()
const mlMath = require('ml-math')

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
    ipcRenderer.send('resizeSettings')
    let min    = $("#timeMin").val()
    let sec    = $("#timeSec").val()
    let status = $("#status")
    status.removeClass()
    status.addClass("animated bounceIn alert alert-primary")

    if (!mlMath.numbers.isNumeric(min)){
        if (mlMath.numbers.isNumeric(sec)){
            min = 0
            $("#timeMin").val('0')
        }else{
            status.addClass('keinErfolg')
            status.html("Ungültige Zahl!")
            return; 
        }
    }

    if (!mlMath.numbers.isNumeric(sec)){
        if (mlMath.numbers.isNumeric(min)){
            sec = 0
            $("#timeSec").val('0')
        }else{
            status.addClass('keinErfolg')
            status.html("Ungültige Zahl!")
            return; 
        }
    }

    status.addClass('erfolg')
    settingsStore.set('timeMin', min)
    settingsStore.set('timeSec', sec)

    status.html("Erfolgreich gespeichert.")
    ipcRenderer.send('settingsGespeichert')
})