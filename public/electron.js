const path = require('path');
const isDev = require('electron-is-dev');
const { app, BrowserWindow, ipcMain } = require('electron');
const Store = require('electron-store');

let mainWindow;
let store = new Store();

function createWindow() {
    function setLocalStorageDatabase() {
        mainWindow.webContents.executeJavaScript(`localStorage.setItem(
            'customer-database',
            ${JSON.stringify(store.get('customer-database'))})`);

        mainWindow.webContents.executeJavaScript(`localStorage.setItem(
            'item-database',
            ${JSON.stringify(store.get('item-database'))})`);
    }

    mainWindow = new BrowserWindow({
        width: 900,
        height: 680,
        show: false,
        webPreferences: {
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

    ipcMain.on('store-data', (e, arg) => {
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
