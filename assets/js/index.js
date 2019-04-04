const {
   ipcRenderer
} = require('electron')

$(function () {
   ipcRenderer.send('finishedLoading')

   let btn = $("#btnStartUpdate")
   btn.click(function () {
      btn.prop('disabled', true);
      btn.html("Suche..")
      ipcRenderer.send('startUpdate')
   })
})