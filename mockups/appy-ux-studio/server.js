const http = require('http');
const fs = require('fs');
const path = require('path');

const mime = {
  'html': 'text/html',
  'css': 'text/css',
  'js': 'application/javascript',
  'mp4': 'video/mp4',
  'jpg': 'image/jpeg',
  'png': 'image/png',
  'svg': 'image/svg+xml',
  'json': 'application/json'
};

const server = http.createServer((req, res) => {
  let filePath = path.join(process.cwd(), req.url === '/' ? 'index.html' : req.url);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found: ' + req.url);
      return;
    }
    const ext = path.extname(filePath).slice(1);
    res.writeHead(200, { 'Content-Type': mime[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

server.listen(8080, '0.0.0.0', () => {
  console.log('Server running on http://localhost:8080');
});
