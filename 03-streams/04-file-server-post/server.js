const url = require('url');
const http = require('http');
const path = require('path');
const LimitSizeStream = require('./LimitSizeStream.js');
const fs = require('fs');
const { error } = require('console');
const { constants } = require('buffer');

const receiveFile = require('./receiveFile');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  if (pathname.includes('/') || pathname.includes('..')) {
    res.statusCode = 400;
    res.end('Nested paths are not allowed');
    return;
  }

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      const writeStream = fs.createWriteStream(filepath, {flags: 'wx'});
      const limitStream = new LimitSizeStream({limit: 1e6});

      if (pathname.includes('/') || pathname.includes('..')) {
        res.statusCode = 400;
        res.end('Nested paths are not allowed');
        return;
      }

      req.pipe(limitStream).pipe(writeStream);

      
      writeStream.on('error', (error) => {
        if (error.code === 'EEXIST') {
          res.statusCode = 409;
          res.end('File exists');
        } else {
          res.statusCode = 500;
          res.end('Internal server error');
          fs.unlink(filepath, (error) => {});
        }
      });

      writeStream.on('finish', () => {
        res.statusCode = 201;
        res.end('file has been saved');
      });

      req.on('aborted', () => {
        fs.unlink(filepath, (error) => {});
      });

      limitStream.on('error', (error) => {
        if (error.code === 'LIMIT_EXCEEDED') {
          res.statusCode = 413;
          res.end('File is too big');
        } else {
          res.statusCode = 500;
          res.end('Internal server error');
        }
    
        fs.unlink(filepath, (err) => {});
      });

      break;
  
    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});
module.exports = server;
