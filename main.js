const http = require('node:http');
const { fork } = require('node:child_process');

class MainProcess {
  constructor() {
    this.childs = [];
  }
  startChild(marketID) {
    const child = fork('index.js',[] ,{ killSignal: 'SIGINT' });
    child.on('error', (err) => {
      this.childs.splice(this.childs.indexOf(child), 1);
    });
    child.send({ market: marketID });
    this.childs.push(child);
  }
  stopChild(marketID) {
    this.childs.forEach((child) => {
      if (child.pid === marketID) {
        child.send('exit');
        this.childs.splice(this.childs.indexOf(child), 1);
      };
    });
  }
  getAllChilds() {
    let childs = [];
    this.childs.forEach((child) => {
      childs.push(child.pid);
    });
    return childs;
  }
}

const main = new MainProcess();

const server = http.createServer( (req, res) => {
  if (req.url == '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(JSON.stringify(main.getAllChilds()));
    res.end();
  }
  else if (req.url == "/start") {
    res.writeHead(200, { 'Content-Type': '' });
    req.on('data', chunk => {
      const marketID = JSON.parse(chunk);
      main.startChild(marketID);
    });
    res.end();
  }
  else if (req.url == "/stop") {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    req.on('data', chunk => {
      const marketID = JSON.parse(chunk);
      main.stopChild(marketID);
    });
    res.end(); 
  }
  else
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end();
  });



const hostname = '127.0.0.1';
const port = process.env.PORT || 3000;


server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});




