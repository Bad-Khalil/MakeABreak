const {app, ipcRenderer} = require('electron')

ipcRenderer.on('message', function(event, text) {    
   $("#test").html(text);
})

ipcRenderer.on('downloading', function(event, percent){
   $("#test").html(percent + "%");
})