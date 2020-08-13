import * as path from 'path';
import { ipcMain } from 'electron';
import { TimeTracker } from './app/timetracker';

// @ts-ignore
const { menubar } = require('menubar');
const tt = new TimeTracker();

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

ipcMain.on('start', (event: any) => {
    tt.start();
});
