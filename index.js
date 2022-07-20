const BinanceWorker = require('./worker');

let worker = undefined;

process.on('message', (msg) => {
    worker = new BinanceWorker(msg.market);
    
    console.log('Message from main:', msg);
});
  
process.on('exit',on_exit);
  
function on_exit(){
    console.log('Process Exit ' + worker.getName());
    worker.stop();
    process.exit(0);
}
