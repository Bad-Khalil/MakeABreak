const {
    ipcRenderer
} = require('electron')

$(function () {
    ipcRenderer.send('finishedLoading')
    setTimeout(function () {
        $("#somethingNew").addClass("animated fadeOut")

        setTimeout(function () {
            $("#somethingNew").removeClass();
            $("#somethingNew").addClass("invisible")
        }, 1000);

    }, 2000);

    $("#openChangelog").click(function () {
        ipcRenderer.send('openChangelog')
    })

    $("#settingsBtn").click(function () {
        ipcRenderer.send('openSettings')
    })

    // Wird aufgerufen, wenn man in den Einstellungen auf Speichern geklickt hat
    ipcRenderer.on('window', function (event, text) {
        if (text == 'reload') {
            init()
        }
    })
})