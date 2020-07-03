const path = require('path');

module.exports = {
  apps : [{
    name: 'blogwoo-client',
    version: '0.0.1',
    script: path.join(__dirname, 'bin/www'),
    watch: true,
    // max_memory_restart: '1G',
    env: {
      PORT: 1024,
      NODE_ENV: 'development'
    },
    env_local: {
      PORT: 1024,
      NODE_ENV: 'development'
    },
    env_development: {
      PORT: 1024,
      NODE_ENV: 'development'
    },
    env_staging: {
      PORT: 3000,
      NODE_ENV: 'staging',
    },
    env_production: {
      PORT: 3000,
      NODE_ENV: 'production'
    }
  }]
};
