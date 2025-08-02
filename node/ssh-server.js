// ssh-server.js
const { Server } = require('ssh2');
const fs = require('fs');
const path = require('path');
const startBlessedApp = require('./server.js');

const server = new Server({
  hostKeys: [fs.readFileSync(path.join(__dirname, 'host.key'))],
});

server.on('connection', (client) => {
  console.log('Client connected!');

  client.on('authentication', (ctx) => {
    console.log('Authentication received. Accepting any connection.');
    ctx.accept();
  });

  client.on('ready', () => {
    console.log('Client authenticated and ready.');

    client.on('session', (accept, reject) => {
      const session = accept();
      let ptyInfo;

      session.on('pty', (accept, reject, info) => {
        ptyInfo = info;
        console.log('PTY info received:', info);
        accept();
      });

      session.on('shell', (accept, reject) => {
        if (!ptyInfo) {
          ptyInfo = {
            term: 'xterm-256color',
            cols: 80,
            rows: 24
          };
          console.warn('No PTY info provided, using fallback:', ptyInfo);
        }
        
        console.log('Starting shell with PTY info:', ptyInfo);
        const stream = accept();
        
        if (!stream.isTTY) {
          stream.isTTY = true;
        }
        
        stream.columns = ptyInfo.cols || 80;
        stream.rows = ptyInfo.rows || 24;
        
        try {
          console.log('Starting Blessed app...');
          startBlessedApp(stream, ptyInfo);
        } catch (err) {
          console.error('Error starting Blessed app:', err);
          stream.write('Error rendering UI: ' + err.message + '\r\n');
          stream.end();
        }
      });
    });
  });

  client.on('error', (err) => {
    console.error('Client error:', err);
  });
});

server.listen(22, '0.0.0.0', () => {
  console.log('SSH server listening on port 22');
});