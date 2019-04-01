const {
  app,
  BrowserWindow
} = require('electron')

const path = require('path')
const {
  autoUpdater
} = require('electron-updater')
const ipc      = require('electron').ipcMain
const notifier = require('node-notifier')

let win

function createWindow() {
  // Erstellen des Browser-Fensters.
  win = new BrowserWindow({
    width      : 600,
    height     : 400,
    maximizable: false
  })

  win.setResizable(false)

  // und Laden der index.html der App.
  win.loadFile('assets/pages/index.html')

  // Öffnen der DevTools.
  // win.webContents.openDevTools()

  // Ausgegeben, wenn das Fenster geschlossen wird.
  win.on('closed', () => {
    // Dereferenzieren des Fensterobjekts, normalerweise würden Sie Fenster
    // in einem Array speichern, falls Ihre App mehrere Fenster unterstützt. 
    // Das ist der Zeitpunkt, an dem Sie das zugehörige Element löschen sollten.
    win = null
  })
}

// Diese Methode wird aufgerufen, wenn Electron mit der
// Initialisierung fertig ist und Browserfenster erschaffen kann.
// Einige APIs können nur nach dem Auftreten dieses Events genutzt werden.
app.on('ready', function () {
  // Create the Menu
  // const menu = Menu.buildFromTemplate(template);
  // Menu.setApplicationMenu(menu);
  autoUpdater.checkForUpdates()
  createWindow()
})

// Verlassen, wenn alle Fenster geschlossen sind.
app.on('window-all-closed', () => {
  // Unter macOS ist es üblich, für Apps und ihre Menu Bar
  // aktiv zu bleiben, bis der Nutzer explizit mit Cmd + Q die App beendet.
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // Unter macOS ist es üblich ein neues Fenster der App zu erstellen, wenn
  // das Dock Icon angeklickt wird und keine anderen Fenster offen sind.
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
  autoUpdater.quitAndInstall()
})

// Wenn Zeit des Timers abgelaufen ist
ipc.on('timeOver', function () {
  notifier.notify({
    title  : 'Make a Break',
    message: 'Du solltest nun eine Pause einlegen!',
    icon   : path.join(__dirname, 'icon.png'),         // Absolute path (doesn't work on balloons)
    sound  : true,                                     // Only Notification Center or Windows Toasters
    wait   : false                                     // Wait with callback, until user action is taken against notification
  })
})

ipc.on('settingsGespeichert', function () {  
  win.webContents.send('window', 'reload') 
})

// Wenn App geladen ist, dann Version der App anzeigen lassen
ipc.on('finishedLoading', function (event, text) {
  win.webContents.send('getVersion', 'Version ' + app.getVersion()) 
})

ipc.on('openSettings', function (event, text) {
  winSettings = new BrowserWindow({
    width      : 300,
    height     : 480,
    maximizable: false
  })

  winSettings.setResizable(false)

  // und Laden der index.html der App.
  winSettings.loadFile('assets/pages/einstellungen.html')
  winSettings.on('closed', () => {
    winSettings = null
  })
})

ipc.on('openChangelog', function (event, text) {
  winSettings = new BrowserWindow({
    width      : 380,
    height     : 520,
    maximizable: false
  })

  // winSettings.setResizable(false)

  // und Laden der index.html der App.
  winSettings.loadFile('assets/pages/changelog.html')
  winSettings.on('closed', () => {
    winSettings = null
  })
})
