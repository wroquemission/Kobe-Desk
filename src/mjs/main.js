const {
    app,
    BrowserWindow,
    ipcMain,
    Menu,
} = require('electron');

require('@electron/remote/main').initialize();

const isMac = process.platform === 'darwin';

const path = require('path');

const windowStateKeeper = require('electron-window-state');

const FileIO = require('./fileio');

const fileio = new FileIO();
fileio.setup();

require('./settings.js');

const url = require('url');

const fixPath = require('fix-path');
fixPath();

const mainWinObject = {
    icon: '../assets/icon.png',
    titleBarStyle: 'hidden',
    titleBarOverlay: {
        color: '#292929',
        symbolColor: '#fff',
    },
    minWidth: 600,
    minHeight: 450,
    backgroundColor: '#fff',
    show: false,
    webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true,
        contextIsolation: false
    },
    movable: true
};

let mainWin;

function createWindow() {
    let mainWindowState = windowStateKeeper({
        defaultWidth: 800,
        defaultHeight: 600
    });

    mainWinObject.width = mainWindowState.width;
    mainWinObject.height = mainWindowState.height;

    mainWinObject.x = mainWindowState.x;
    mainWinObject.y = mainWindowState.y;

    mainWin = new BrowserWindow(mainWinObject);
    mainWin.loadURL(url.format({
        pathname: path.join(__dirname, '../html/index.html'),
        protocol: 'file:',
        slashes: true
    }));

    require("@electron/remote/main").enable(mainWin.webContents);

    mainWin.webContents.openDevTools({ mode: 'detach' });

    mainWin.webContents.once('did-finish-load', () => {
        mainWin.show();
    });
    mainWin.on('closed', e => mainWin = null);

    mainWindowState.manage(mainWin);
};

let windowPromise = new Promise((resolve, _) => {
    app.on('ready', () => {
        createWindow();
        resolve();
    });
});

app.on('activate', () => {
    if (!mainWin) {
        mainWin = createWindow();
    }
});

ipcMain.on('save-data', (event, data) => {
    fileio.writeData(data, fileio.normalize('data.json'));
    event.returnValue = '';
});

ipcMain.on('load-data', (event) => {
    const data = fileio.readData(fileio.normalize('data.json'));

    event.returnValue = data;
});

const template = [
    ...(isMac ? [{
        label: app.name,
        submenu: [
            { role: 'about' },
            { type: 'separator' },
            {
                label: 'Preferences',
                click: openPreferences,
                accelerator: 'CmdOrCtrl+,'
            },
            { type: 'separator' },
            { role: 'services' },
            { type: 'separator' },
            { role: 'hide' },
            { role: 'hideOthers' },
            { role: 'unhide' },
            { type: 'separator' },
            { role: 'quit' }
        ]
    }] : []),
    {
        label: 'Edit',
        submenu: [
            { role: 'undo' },
            { role: 'redo' },
            { type: 'separator' },
            { role: 'cut' },
            { role: 'copy' },
            { role: 'paste' },
            ...(isMac ? [
                { role: 'delete' },
                { role: 'selectAll' },
                { type: 'separator' },
                {
                    label: 'Speech',
                    submenu: [
                        { role: 'startSpeaking' },
                        { role: 'stopSpeaking' }
                    ]
                }
            ] : [
                { role: 'delete' },
                { type: 'separator' },
                { role: 'selectAll' }
            ])
        ]
    },
    {
        label: 'View',
        submenu: [
            { type: 'separator' },
            { role: 'resetZoom' },
            { role: 'zoomIn' },
            { role: 'zoomOut' },
            { type: 'separator' },
            { role: 'togglefullscreen' },
            { role: 'toggleDevTools' }
        ]
    },
    {
        label: 'Window',
        submenu: [
            { role: 'minimize' },
            { role: 'zoom' },
            ...(isMac ? [
                { type: 'separator' },
                { role: 'front' },
                { type: 'separator' },
                { role: 'window' },
                { role: 'close' }
            ] : [
                { role: 'close' }
            ])
        ]
    }
]

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);