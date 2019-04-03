const {
   ipcRenderer
} = require('electron')

$(function () {
   ipcRenderer.send('finishedLoading')

   $("#version").click(function () {
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

   ipcRenderer.on('getVersion', function (event, version) {
      $("#version").html(version)
   })
})