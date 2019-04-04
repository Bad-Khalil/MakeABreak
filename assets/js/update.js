ipcRenderer.on('message', function (event, text) {
    $("#updateBarContainer").removeClass('invisible')

    if (text == 'updateAvailable') {

      text = "Aktuelle Version gefunden"
      $("#btnStartUpdate").html(text)

    } else if (text == 'updateDownloaded') {
        $("#updateBarInner").width("100%")
       text = "Programm erfolgreich heruntergeladen..."
      $("#btnStartUpdate").html(text)
    }

    $("#updateTxt").html(text);
 })

 ipcRenderer.on('downloading', function (event, percent) {
   $("#btnStartUpdate").html('Lade Update')
    $("#updateTxt").html("Lade Update: " + roundTo(percent, 1) + "%")
    $("#updateBarInner").width(roundTo(percent,0) + "%")
 })