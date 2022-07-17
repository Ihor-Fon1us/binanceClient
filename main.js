const http = require('node:http');
const { fork } = require('node:child_process');

class MainProcess {
  constructor() {
    this.childs = [];
  }
  startChild(marketID) {
    const child = fork('index.js');
    child.on('error', (err) => {
      // This will be called with err being an AbortError if the controller aborts
    });
    child.send({ market: marketID });
    this.childs.push(child);
  }
  stopChild(marketID) {
    this.childs.forEach((child) => {
      if (child.pid === marketID) {
        //this.childs.splice(child, 1);
        child.kill();
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
const market = {
  BTCUSDT: {
    id: "BTCUSDT",
    base: "BTC",
    quote: "USDT",
  },
  LTCUSDT: {
    id: "LTCUSDT",
    base: "LTC",
    quote: "USDT",
  },
  ETHUSDT: {
    id: "ETHUSDT",
    base: "ETH",
    quote: "USDT",
  },
  BNBUSDT: {
    id: "BNBUSDT",
    base: "BNB",
    quote: "USDT",
  }
}
const server = http.createServer( (req, res) => {
  if (req.url == '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(JSON.stringify(main.getAllChilds()));
    res.end();
  }
  else if (req.url == "/start") {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    main.startChild(market.BTCUSDT);
    res.end();
  }
  else if (req.url == "/stop") {
    
  }
  else
    res.writeHead(200, { 'Content-Type': 'text/html' });
    main.stopChild(req.url.split('/')[1]);
    res.end(); 
  });

const hostname = '127.0.0.1';
const port = 3000;


server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});




