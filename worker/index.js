const redis = require("redis");

const keys = require('./conf/keys');
const calculateFibonacci = require('./fibonacci');

// connect to redis
const redisClient = redis.createClient({ host: keys.redisHost, port: keys.redisPort });
const redisSub = redisClient.duplicate();

// subscribe and watch new values in redis, calculate fibonacci and update redis
redisSub.on('message', (channel, message) => redisClient.hset('values', message, calculateFibonacci(parseInt(message))))
redisSub.subscribe('insert');
