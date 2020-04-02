'use strict';

const db = require('./db.js');

module.exports = async server => {
  server = await db(server);

  return server;
};
