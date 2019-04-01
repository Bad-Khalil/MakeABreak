const {
   ipcRenderer
} = require('electron')

$(function () {
   ipcRenderer.send('finishedLoading')

   $("#settingsBtn").click(function () {
      ipcRenderer.send('openSettings')
   })

   // Wird aufgerufen, wenn man in den Einstellungen auf Speichern geklickt hat
   ipcRenderer.on('window', function (event, text) {
      if (text == 'reload') {
         init()
      }
   })
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