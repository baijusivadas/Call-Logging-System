const { createClient } = require('redis');
const config = require('../config/redis');

class RedisClient {
  constructor() {
    this.client = createClient({
      url: `redis://${config.host}:${config.port}`,
      password: config.password
    });
    
    this.client.on('error', (err) => console.error('Redis Client Error', err));
  }

  async connect() {
    await this.client.connect();
    console.log('Connected to Redis');
  }

  async set(key, value, ttl = null) {
    if (ttl) {
      return this.client.set(key, value, { EX: ttl });
    }
    return this.client.set(key, value);
  }

  async get(key) {
    return this.client.get(key);
  }

  async del(key) {
    return this.client.del(key);
  }

  async disconnect() {
    await this.client.disconnect();
  }
}

module.exports = new RedisClient();