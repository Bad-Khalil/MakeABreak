const {app, ipcRenderer} = require('electron')

ipcRenderer.on('message', function(event, text) { 
   $("#test").html(text);
})