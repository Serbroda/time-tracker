import * as path from 'path';
import { ipcMain, BrowserWindow } from 'electron';

// @ts-ignore
const { menubar } = require('menubar');

const mb = menubar({
    cwd: __dirname,
    index: `file://${path.join(__dirname, 'index.html')}`,
    icon: path.join(path.join(__dirname, 'time.png')),
    browserWindow: {
        webPreferences: {
            nodeIntegration: true,
        },
    },
});

mb.on('ready', () => {
    console.log('Menubar app is ready.', mb);
});

mb.on('show', () => {
    console.log('Show');
    const win = mb.window as BrowserWindow;
    if (win && win.webContents) {
        win.webContents.openDevTools();
    }
});

ipcMain.on('start', (event: any) => {
    console.log('Main: start');
});
