const {
  app,
  BrowserWindow
} = require('electron')

const path = require('path')
const {
  autoUpdater
} = require('electron-updater')
const ipc = require('electron').ipcMain
const notifier = require('electron-notifications')
const lockSystem = require('lock-system');

let win

function createWindow() {
  win = new BrowserWindow({
    width : 715,
    height: 720,
  })

  win.loadFile('assets/pages/index.html')

  // Öffnen der DevTools.
  // win.webContents.openDevTools()

  win.on('closed', () => {
    win = null
    app.quit()
  })
}

function createSettingsWindow(){
  winSettings = new BrowserWindow({
    width      : 520,
    height     : 650,
    maximizable: false
  })

  winSettings.loadFile('assets/pages/einstellungen.html')
  winSettings.on('closed', () => {
    winSettings = null
  })
}

function createChangelogWindow() {
  winChangelog = new BrowserWindow({
    width: 380,
    height: 520,
    maximizable: false
  })

  winChangelog.loadFile('assets/pages/changelog.html')
  winChangelog.on('closed', () => {
    winChangelog = null
  })
}

function timeOver(){
 
  let pcSperren = true;
  const notification = notifier.notify('Make a Break', {
    message : 'In 10 Sek. wird PC gesperrt',
    icon    : path.join(__dirname, 'icon.png'),
    buttons : ['Nicht sperren'],
    duration: 10000,
    flat    : true
  })  

  notification.on('buttonClicked', (text, buttonIndex, options) => {
    pcSperren = false;
    notification.close()
    win.setAlwaysOnTop(true);
  })  

  setTimeout(function () {    
    if (pcSperren){
      lockSystem();
    }
  }, 10000);
}

app.on('ready', function () {
  // const menu = Menu.buildFromTemplate(template);
  // Menu.setApplicationMenu(menu);
  autoUpdater.checkForUpdates()
  createWindow()
})


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})


// In dieser Datei können Sie den Rest des App-spezifischen 
// Hauptprozess-Codes einbinden. Sie können den Code auch 
// auf mehrere Dateien aufteilen und diese hier einbinden.
// -------------------------------------------------------------------
// Updater
// -------------------------------------------------------------------
autoUpdater.on('update-available', (ev, info) => {
  win.webContents.send('message', 'updateAvailable')
})

autoUpdater.on('download-progress', (progressObj) => {
  win.webContents.send('downloading', progressObj.percent)
})

autoUpdater.on('update-downloaded', (ev, info) => {
  win.webContents.send('message', 'updateDownloaded')
})

ipc.on('installUpdate', function () {
  autoUpdater.quitAndInstall(false)
})

// Wenn Zeit des Timers abgelaufen i
ipc.on('timeOver', function () {
 timeOver()
})

ipc.on('settingsGespeichert', function () {
  win.webContents.send('window', 'reload')
})

// Wenn App geladen ist, dann Version der App anzeigen lassen
ipc.on('finishedLoading', function (event, text) {
})

ipc.on('openSettings', function (event, text) {
  createSettingsWindow()
})

ipc.on('openChangelog', function (event, text) {
  createChangelogWindow()
})