const {
   app,
   ipcRenderer
} = require('electron')

$(function () {   
   ipcRenderer.send('finishedLoading')

   ipcRenderer.on('message', function (event, text) {
      $("#update").addClass("visible");

      if (text == 'updateAvailable') {
         text = "Es ist ein Update verfügbar."
      } else if (text == 'updateDownloaded') {
         text = "Update erfolgreich heruntergeladen..."
      }

      $("#update").html(text);
   })

   ipcRenderer.on('getVersion', function (event, version) {
      $("#version").html(version)
   })

   ipcRenderer.on('downloading', function (event, percent) {
      $("#update").addClass("visible");
      $("#update").html(percent + "%");
   })
})