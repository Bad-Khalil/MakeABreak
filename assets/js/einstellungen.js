const {ipcRenderer} = require('electron');
const {numbers}     = require('ml-math');
const Store         = require('electron-store');
const settingsStore = new Store();

function checkIfNumeric(min, sec) {
    let status = $("#status");
    if (!numbers.isNumeric(min)) {
        if (numbers.isNumeric(sec)) {
            min = 0;
            $("#timeMin").val('0')
        } else {
            status.addClass('noSuccess');
            status.html("Invalid number!");
            return false
        }
    }

    if (!numbers.isNumeric(sec)) {
        if (numbers.isNumeric(min)) {
            sec = 0;
            $("#timeSec").val('0')
        } else {
            status.addClass('noSuccess');
            status.html("Invalid number!");
            return false
        }
    }

    return true
}

function save() {
    let min = $("#timeMin").val();
    let sec = $("#timeSec").val();
    let status = $("#status");
    let minimize = '';

    status.removeClass();
    status.addClass("animated bounceIn alert alert-primary");

    if ($("#minimize").is(':checked')) {
        minimize = 'x'
    }

    if (!checkIfNumeric(min, sec)) {
        return
    }

    status.addClass('success');
    settingsStore.set('timeMin', min);
    settingsStore.set('timeSec', sec);
    settingsStore.set('minimize', minimize);

    status.html("Successfully saved.");
    ipcRenderer.send('settingsGespeichert')
}

$(function () {
    let timeMin = settingsStore.get('timeMin');
    let timeSec = settingsStore.get('timeSec');
    let minimize = settingsStore.get('minimize');

    if (minimize === 'x') {
        $("#minimize").prop('checked', true)
    }

    $("#timeMin").val(timeMin);
    $("#timeSec").val(timeSec)
});

$("#timeMin").change(function () {
    $("#status").removeClass('success noSuccess status');
    $("#status").html("Set your values here.")
});

$("#btnSpeichern").click(function () {
    save()
});

$("#quickSelect").change(function () {
    const min = $("#quickSelect").val();
    $("#timeSec").val('');
    $("#timeMin").val(min);
    save()
});
