const path = require('path');
const Store = require('electron-store');
const isDev = require('electron-is-dev');
const { app, BrowserWindow, ipcMain } = require('electron');

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

    setLocalStorageDatabase();

    ipcMain.on('store-data', (_, arg) => {
        const { id, value } = JSON.parse(arg);
        store.set(id, value);
        setLocalStorageDatabase();
    });
}

app.on('ready', createWindow);
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
app.on('activate', () => {
    if (mainWindow === null) createWindow();
});
