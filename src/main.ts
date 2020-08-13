import * as path from 'path';
// @ts-ignore
const { menubar } = require('menubar');

const mb = menubar({
    cwd: __dirname,
    index: `file://${path.join('index.html')}`,
    icon: path.join('index.html'),
});

mb.on('ready', () => {
    console.log('Menubar app is ready.');
});
