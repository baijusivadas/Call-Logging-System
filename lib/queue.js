const { Queue } = require('bull');
const RedisClient = require('./redisClient');

class TinderQueue {
  constructor(queueName) {
    this.queue = new Queue(queueName, {
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD || ''
      }
    });
  }

  async addJob(data, options = {}) {
    return this.queue.add(data, options);
  }

  process(processor) {
    this.queue.process(processor);
  }

  async close() {
    await this.queue.close();
  }
}

module.exports = TinderQueue;