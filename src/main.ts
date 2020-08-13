import * as path from 'path';
// @ts-ignore
const { menubar } = require('menubar');

const mb = menubar({
    cwd: __dirname,
    index: `file://${path.join(__dirname, 'index.html')}`,
    icon: path.join(path.join(__dirname, 'time.png')),
});

mb.on('ready', () => {
    console.log('Menubar app is ready.');
});
