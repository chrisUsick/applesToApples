var config = require('../../config/connections').connections.redis;
var redis = require("redis"),
    client = redis.createClient({
      host:config.host,
      port:config.port
    });
var bluebird = require('bluebird');
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

client.on("error", function (err) {
  console.log("Redis Error " + err);
});
module.exports = client;
