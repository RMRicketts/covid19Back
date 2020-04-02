'use strict';

//const s3 = require('./s3.js');
const db = require('./db.js');

module.exports = async server => {
  server = await db(server);
//  server = await s3(server);

  return server;
};
