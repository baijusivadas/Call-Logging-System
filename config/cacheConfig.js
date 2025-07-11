// config/cacheConfig.js
require('dotenv').config();

module.exports = {
  CACHE_EXPIRATION_MEDIUM: parseInt(process.env.CACHE_EXPIRATION_MEDIUM) || 60 * 30, // default 30 min
};
