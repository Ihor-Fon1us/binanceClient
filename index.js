const BinanceWorker = require('./worker');
process.on('message', (msg) => {
  const worker = new BinanceWorker(msg.market);
  console.log('Message from main:', msg);
});

