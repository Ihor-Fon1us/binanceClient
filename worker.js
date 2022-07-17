const { BinanceClient } = require('ccxws');
const { createClient } = require('redis');

class BinanceWorker {
  constructor(market) {
    this.redisClient = createClient();
    this.redisClient.on('error', (err) => console.log('Redis Client Error', err));
    this.redisClient.connect();
    this.binanceClient = new BinanceClient();
    this.binanceClient.subscribeLevel2Updates(market);
    this.binanceClient.on('l2update', (data) => {
        this.handler(data.asks, `${market.id}_asks`, () => {
                // some massage to main process
                console.log(`${market.id} asks`);
            });
        this.handler(data.bids, `${market.id} bids`, () => {
                // some massage to main process
                console.log(`${market.id} bids`);
            });
    });    
  }

  async handler(data, prefix, message) {
    for(const element of data) {
        const key = `${prefix}_${element.price}`;
        if(element.size != 0) {
            try {
                await this.redisClient.set(key, element.size);
            } catch (error) {
                // some error to main process
                console.log(error);
            }
            // add element to db
        } else{
            try {
                await this.redisClient.del(key);
            } catch (error) {
                // some error to main process
                console.log(error);
            }
            // delete element from db
        }
    };
    return message();    
  }
}

module.exports = BinanceWorker;
