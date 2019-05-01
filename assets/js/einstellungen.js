const {ipcRenderer} = require('electron')
const Store = require('electron-store')
const {numbers} = require('ml-math')
const settingsStore = new Store()

function checkIfNumeric(min, sec) {
    let status = $("#status")
    if (!numbers.isNumeric(min)) {
        if (numbers.isNumeric(sec)) {
            min = 0
            $("#timeMin").val('0')
        } else {
            status.addClass('noSuccess')
            status.html("Invalid number!")
            return false
        }
    }

    if (!numbers.isNumeric(sec)) {
        if (numbers.isNumeric(min)) {
            sec = 0
            $("#timeSec").val('0')
        } else {
            status.addClass('noSuccess')
            status.html("Invalid number!")
            return false
        }
    }

    return true
}

function save() {
    let min = $("#timeMin").val()
    let sec = $("#timeSec").val()
    let status = $("#status")
    let minimieren = ''

    status.removeClass()
    status.addClass("animated bounceIn alert alert-primary")

    if ($("#minimieren").is(':checked')) {
        minimieren = 'x'
    }

    if (!checkIfNumeric(min, sec)) {
        return
    }

    status.addClass('success')
    settingsStore.set('timeMin', min)
    settingsStore.set('timeSec', sec)
    settingsStore.set('minimieren', minimieren)

    status.html("Successfully saved.")
    ipcRenderer.send('settingsGespeichert')
}

$(function () {
    let timeMin = settingsStore.get('timeMin')
    let timeSec = settingsStore.get('timeSec')
    let minimieren = settingsStore.get('minimieren')

    if (minimieren === 'x') {
        $("#minimieren").prop('checked', true)
    }

    $("#timeMin").val(timeMin)
    $("#timeSec").val(timeSec)
})

$("#timeMin").change(function () {
    $("#status").removeClass('success noSuccess status')
    $("#status").html("Set your values here.")
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
