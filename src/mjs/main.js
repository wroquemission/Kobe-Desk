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

const fs = require('fs');

require('./settings.js');

const url = require('url');

const fixPath = require('fix-path');
const { create } = require('domain');
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

function createWindow(windowName, windowObject) {
    let window = new BrowserWindow(windowObject);

    window.loadURL(url.format({
        pathname: path.join(__dirname, `../html/${windowName}.html`),
        protocol: 'file:',
        slashes: true
    }));

    require("@electron/remote/main").enable(window.webContents);

    window.webContents.openDevTools({ mode: 'detach' });

    window.webContents.once('did-finish-load', () => {
        window.show();
    });

    return window;
};

let mainWin;

app.on('ready', () => {
    let mainWindowState = windowStateKeeper({
        defaultWidth: 800,
        defaultHeight: 600
    });

    mainWinObject.width = mainWindowState.width;
    mainWinObject.height = mainWindowState.height;

    mainWinObject.x = mainWindowState.x;
    mainWinObject.y = mainWindowState.y;

    mainWin = createWindow('index', mainWinObject);

    mainWindowState.manage(mainWin);
});

ipcMain.on('save-data', (event, data) => {
    fileio.writeData(data, fileio.normalize('data.json'));
    event.returnValue = '';
});

ipcMain.on('load-data', (event) => {
    const data = fileio.readData(fileio.normalize('data.json'));

    event.returnValue = data;
});

ipcMain.on('create-window', (event, windowName, windowObject) => {
    createWindow(windowName, windowObject);

    event.returnValue = '';
});

ipcMain.on('get-images', (event, directory) => {
    const files = fileio.listDir(
        path.join(fileio.normalize('Images'), directory)
    );

    event.returnValue = files.map(fileName => {
        const extension = path.extname(fileName).slice(1);
        const basename = path.basename(fileName, '.' + extension);

        const raw = fs.readFileSync(
            path.join(fileio.normalize('Images'), directory, fileName)
        );

        return { basename, extension, raw };
    });
});

ipcMain.on('save-image', (event, directory, fileName, sourcePath, isBase64) => {
    const filePath = path.join(fileio.normalize('Images'), directory, fileName);

    fs.mkdirSync(path.dirname(filePath), {
        recursive: true
    });

    const data = fs.readFileSync(sourcePath);

    const files = fileio.write(
        filePath,
        data,
        isBase64
    );

    event.returnValue = '';
});

const warningWinObject = {
    show: true,
    webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true,
        contextIsolation: false
    },
    movable: true,
    titleBarStyle: 'hidden',
    titleBarOverlay: {
        color: '#fff',
        symbolColor: '#000',
    },
    width: 600,
    height: 450,
    backgroundColor: '#fff',
};

let warningWin;

ipcMain.on('append-warning', (event, warning) => {
    if (!warningWin) {
        warningWin = createWindow('warning', warningWinObject);

        warningWin.webContents.once('dom-ready', () => {
            warningWin.webContents.send('append-warning', warning);
        });

        warningWin.on('closed', () => {
            warningWin = undefined;
        });
    } else {
        warningWin.webContents.once('dom-ready', () => {
            warningWin.webContents.send('append-warning', warning);
        });
    }

    event.returnValue = '';
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