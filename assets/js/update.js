ipcRenderer.on('message', function (event, text) {
    $("#updateBarContainer").removeClass('invisible')

    if (text == 'updateAvailable') {
       text = "Es ist ein Update verfügbar."
    } else if (text == 'updateDownloaded') {
        $("#updateBarInner").width("100%")
        $("#syncIcon").addClass('invisible')
        $("#installUpdateBtn").removeClass('invisible')
    }
 })

 ipcRenderer.on('downloading', function (event, percent) {
   //  $("#updateTxt").html("Lade Update: " + roundTo(percent, 1) + "%")
    $("#updateBarInner").width(roundTo(percent,0) + "%")
 })

 
 $("#installUpdateBtn").click(function () {    
   ipcRenderer.send('installUpdate')
 })