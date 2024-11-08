// config/redisClient.js
const redis = require("redis");

const client = redis.createClient({
  host: "localhost", // Ensure this matches your Redis server's host
  port: 6379,        // Make sure Redis is running on this port
});

client.on("connect", () => {
  console.log("Connected to Redis");
});

client.on("error", (err) => {
  console.error("Redis error:", err);
});

module.exports = client;
