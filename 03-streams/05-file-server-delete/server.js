const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'DELETE':
      if (pathname.indexOf('/') != -1) {
        res.statusCode = 400;
        res.end('No such directory');
        return;
      };
      fs.rm(filepath, function(err) {
        if (err) {
          res.statusCode = 404;
          res.end('Not found');
        } else {
          res.statusCode = 200;
          res.end('done');
        }
      }); 

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
