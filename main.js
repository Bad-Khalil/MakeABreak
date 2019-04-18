const {
    app,
    BrowserWindow,
    Menu,
    dialog
} = require('electron');
const shell = require('electron').shell
const path = require('path');
const {
    autoUpdater
} = require('electron-updater');
const ipc = require('electron').ipcMain;
const notifier = require('node-notifier');
const notifierMac = require('electron-notifications');
const lockSystem = require('lock-system');
const windowStateKeeper = require('electron-window-state');

let win;

function createWindow() {

    let mainWindowState = windowStateKeeper({
        defaultWidth: 1000,
        defaultHeight: 800
    });

    // Create the window using the state information
    win = new BrowserWindow({
        'x': mainWindowState.x,
        'y': mainWindowState.y,
        'width': mainWindowState.width,
        'height': mainWindowState.height
    });

    win.loadFile('assets/pages/index.html');
    win.on('closed', () => {
        win = null;
        app.quit()
    })

    mainWindowState.manage(win);
}

function createSettingsWindow() {
    winSettings = new BrowserWindow({
        width: 520,
        height: 650,
        maximizable: false
    });

    winSettings.loadFile('assets/pages/einstellungen.html');
    winSettings.on('closed', () => {
        winSettings = null
    })
}

function createChangelogWindow() {
    winChangelog = new BrowserWindow({
        width: 380,
        height: 520,
        maximizable: false
    });

    winChangelog.loadFile('assets/pages/changelog.html');
    winChangelog.on('closed', () => {
        winChangelog = null
    })
}

function timeOver() {
    // let pcSperren = true;

    var isWin = process.platform === "win32";

    if (isWin) {
        notifier.notify({
                title: 'Make A Break',
                message: 'In 10 Sek. wird PC gesperrt',
                icon: path.join(__dirname, 'icon.png'), // Absolute path (doesn't work on balloons)
                sound: true, // Only Notification Center or Windows Toasters
                wait: false // Wait with callback, until user action is taken against notification
            },
            function (err, response) {}
        );
    } else {
        const notification = notifierMac.notify('Make a Break', {
            message: 'In 10 Sek. wird PC gesperrt',
            icon: path.join(__dirname, 'icon.png'),
            buttons: ['Ok'],
            duration: 10000,
            flat: true
        })
    }

    setTimeout(function () {
        lockSystem();
    }, 10000);
}

app.on('ready', function () {
    createWindow()
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', () => {
    if (win === null) {
        createWindow()
    }
});

var menu = Menu.buildFromTemplate([{
    label: 'Menü',
    submenu: [
        {
            label: 'Einstellungen',
            click(){
                createSettingsWindow()
            }
        },
        {
            label: 'Nach Updates suchen',
            click(){
                autoUpdater.checkForUpdates();
                autoUpdater.on('update-not-available', (ev, info) => {                
                    const options = {
                        type   : 'info',
                        title  : 'Information',
                        message: "Sie verwenden die neueste Version.",
                        buttons: ['Ok']
                    }
                
                    dialog.showMessageBox(options, (index) => {})
                });
            }
        }, {
            label: 'Meine Webseite',
            click() {
                shell.openExternal('https://www.michael-lucas.net')
            }
        },
        {
            type: 'separator'
        },
        {
            label: 'Beenden',
            click() {
                app.quit()
            }
        }
    ]
}])
Menu.setApplicationMenu(menu);


// In dieser Datei können Sie den Rest des App-spezifischen 
// Hauptprozess-Codes einbinden. Sie können den Code auch 
// auf mehrere Dateien aufteilen und diese hier einbinden.
// -------------------------------------------------------------------
// Updater
// -------------------------------------------------------------------
autoUpdater.on('update-available', (ev, info) => {
    win.webContents.send('message', 'updateAvailable')

    const options = {
        type   : 'info',
        title  : 'Information',
        message: "Es ist ein Update verfügbar.\nEs wird im Hintergrund geladen.",
        buttons: ['Ok']
    }

    dialog.showMessageBox(options, (index) => {})
});

autoUpdater.on('download-progress', (progressObj) => {
    win.webContents.send('downloading', progressObj.percent)
});

autoUpdater.on('update-downloaded', (ev, info) => {
    win.webContents.send('message', 'updateDownloaded')
    const dialogOpts = {
        type   : 'info',
        buttons: ['Ja', 'Nein'],
        title  : 'Update fertig geladen.',
        message: 'Make A Break',
        detail : 'Die neue Version wurde heruntergeladen.\nMöchten Sie die Version jetzt installieren?'
      }
     
      dialog.showMessageBox(dialogOpts, (response) => {
        if (response === 0) autoUpdater.quitAndInstall()
      })
});

ipc.on('installUpdate', function () {
    autoUpdater.quitAndInstall(false)
});

// Wenn Zeit des Timers abgelaufen i
ipc.on('timeOver', function () {
    timeOver()
});

ipc.on('settingsGespeichert', function () {
    win.webContents.send('window', 'reload')
});

// Wenn App geladen ist, dann Version der App anzeigen lassen
ipc.on('finishedLoading', function (event, text) {
    autoUpdater.checkForUpdates();
});

ipc.on('openSettings', function (event, text) {
    createSettingsWindow()
});

ipc.on('openChangelog', function (event, text) {
    createChangelogWindow()
});