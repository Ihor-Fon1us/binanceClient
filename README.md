add new market -> send JSON to GET /start 
    for example:
    {
    id: "BTCUSDT",
    base: "BTC",
    quote: "USDT",
    }

check current connected markets -> send GET /

remove some market -> send PID GET /stop