ipcRenderer.on('message', function (event, text) {
    $("#updateBarContainer").removeClass('invisible')

    if (text == 'updateAvailable') {
       text = "Es ist ein Update verfügbar."
    } else if (text == 'updateDownloaded') {
        $("#updateBarInner").width("100%")
       text = "Update erfolgreich heruntergeladen..."
    }

    $("#updateTxt").html(text);
 })

 ipcRenderer.on('downloading', function (event, percent) {
    $("#updateTxt").html("Lade Update: " + roundTo(percent, 1) + "%")
    $("#updateBarInner").width(roundTo(percent,0) + "%")
 })