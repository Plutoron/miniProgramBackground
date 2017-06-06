var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'miniprogram'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/miniprogram-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'miniprogram'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/miniprogram-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'miniprogram'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/miniprogram-production'
  }
};

module.exports = config[env];
