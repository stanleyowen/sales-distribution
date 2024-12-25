const path = require('path');
const Store = require('electron-store');
const isDev = require('electron-is-dev');
const { autoUpdater } = require('electron-updater');
const { app, shell, BrowserWindow, ipcMain } = require('electron');

let mainWindow;
let store = new Store();

function createWindow() {
    function setLocalStorageDatabase() {
        [
            'customer-database',
            'item-database',
            'invoice-database',
            'excel-template',
            'script-py',
        ].forEach((key) => {
            mainWindow.webContents.executeJavaScript(`localStorage.setItem(
                '${key}',
                ${JSON.stringify(store.get(key))})`);
        });
    }

    mainWindow = new BrowserWindow({
        width: 900,
        height: 680,
        show: false,
        webPreferences: {
            plugins: true,
            webSecurity: false,
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    mainWindow.loadURL(
        isDev
            ? 'http://localhost:3000'
            : `file://${path.join(__dirname, '../build/index.html')}`
    );
    mainWindow.setMenuBarVisibility(false);
    mainWindow.once('ready-to-show', () => mainWindow.show());
    mainWindow.on('closed', () => (mainWindow = null));
    mainWindow.once('ready-to-show', () => autoUpdater.checkForUpdates());
    mainWindow.webContents.on('new-window', (e, url) => {
        e.preventDefault();
        shell.openExternal(url);
    });

    // Enable refresh functionality
    mainWindow.webContents.on('before-input-event', (event, input) => {
        if ((input.key === 'R' && input.meta) || input.key === 'F5') {
            mainWindow.reload();
            event.preventDefault();
        }
    });

    // Add event listener for F12 key to open DevTools
    mainWindow.webContents.on('before-input-event', (event, input) => {
        if (input.key === 'F12' && input.type === 'keyDown') {
            mainWindow.webContents.openDevTools();
        }
    });

    setLocalStorageDatabase();

    ipcMain.on('store-data', (_, arg) => {
        const { id, value } = JSON.parse(arg);
        store.set(id, value);
        setLocalStorageDatabase();
    });

    ipcMain.on('restart_app', () => autoUpdater.quitAndInstall());
}

app.on('ready', createWindow);
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
app.on('activate', () => {
    if (mainWindow === null) createWindow();
});

autoUpdater.on('update-available', () =>
    mainWindow.webContents.send('update_available')
);
autoUpdater.on('update-downloaded', () =>
    mainWindow.webContents.send('update_downloaded')
);
