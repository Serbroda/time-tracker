import * as path from 'path';
import { ipcMain, App } from 'electron';
import { TimeTracker } from './app/timetracker';
import ElectronStore from 'electron-store';

// @ts-ignore
let tt: TimeTracker;
const { menubar } = require('menubar');

const mb = menubar({
    cwd: __dirname,
    index: `file://${path.join(__dirname, 'index.html')}`,
    icon: path.join(path.join(__dirname, 'time.png')),
    browserWindow: {
        transparent: true,
        webPreferences: {
            nodeIntegration: true,
        },
    },
});

mb.on('ready', () => {
    const app = mb.app as App;
    if (app) {
        const store = new ElectronStore({
            defaults: {
                app: {
                    database: path.join(app.getPath('userData'), 'database.csv'),
                },
            },
        });
        tt = new TimeTracker(store);

        ipcMain.on('start', (event: any) => {
            tt.start();
        });

        ipcMain.on('stop', (event: any) => {
            tt.stop('');
        });
    }
});
