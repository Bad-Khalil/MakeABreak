const {
    app,
    BrowserWindow,
    Menu,
    dialog
} = require('electron');
const path = require('path');
const {
    autoUpdater
} = require('electron-updater');
const shell = require('electron').shell;
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
    });

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
    var isWin = process.platform === "win32";

    if (isWin) {
        notifier.notify({
                title: 'Make A Break',
                message: 'PC is locked in 10 sec.',
                icon: path.join(__dirname, 'icon.png'),
                sound: true,
                wait: false
            },
            function (err, response) {}
        );
    } else {
        const notification = notifierMac.notify('Make a Break', {
            message: 'PC is locked in 10 sec.',
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
    label: 'Menu',
    submenu: [{
            label: 'Settings',
            click() {
                createSettingsWindow()
            }
        },
        {
            label: 'Check for updates',
            click() {
                autoUpdater.checkForUpdates();
                autoUpdater.on('update-not-available', (ev, info) => {
                    const options = {
                        type: 'info',
                        title: 'Information',
                        message: "You are using the latest version.",
                        buttons: ['Ok']
                    };

                    dialog.showMessageBox(options, (index) => {})
                });
            }
        }, {
            label: 'Visit my website',
            click() {
                shell.openExternal('https://www.michael-lucas.net')
            }
        }, {
            type: 'separator'
        }, {
            label: 'Exit',
            click() {
                app.quit()
            }
        }
    ]
}]);
Menu.setApplicationMenu(menu);

// -------------------------------------------------------------------
// Updater
// -------------------------------------------------------------------
autoUpdater.on('update-available', (ev, info) => {
    win.webContents.send('message', 'updateAvailable');

    const options = {
        type: 'info',
        title: 'Information',
        message: "An update is available.\nIt is loaded in the background.",
        buttons: ['Ok']
    };

    dialog.showMessageBox(options, (index) => {})
});

autoUpdater.on('download-progress', (progressObj) => {
    win.webContents.send('downloading', progressObj.percent)
});

autoUpdater.on('update-downloaded', (ev, info) => {
    win.webContents.send('message', 'updateDownloaded');
    const dialogOpts = {
        type   : 'info',
        buttons: ['Yes', 'No'],
        title  : 'Update loaded.',
        message: 'Make A Break',
        detail : 'The new version has been downloaded.\Do you want to install it now?'
    };

    dialog.showMessageBox(dialogOpts, (response) => {
        if (response === 0) autoUpdater.quitAndInstall()
    })
});

ipc.on('installUpdate', function () {
    autoUpdater.quitAndInstall(false)
});

ipc.on('timeOver', function () {
    timeOver()
});

ipc.on('settingsGespeichert', function () {
    win.webContents.send('window', 'reload')
});

// Called after successful loading the app
ipc.on('finishedLoading', function (event, text) {
    autoUpdater.checkForUpdates();
});

ipc.on('openSettings', function (event, text) {
    createSettingsWindow()
});

ipc.on('openChangelog', function (event, text) {
    createChangelogWindow()
});