'use strict';

const mongo = require('mongodb');
const configs = require('../configs/config.js');

module.exports = async server => {
  const connectionURI = process.NODE_ENV === 'production' ? configs.mongoProd : configs.mongoDev;
  let dbs;
  let dtdb;
  try {
    dbs = await mongo.connect(
      connectionURI,
      {useUnifiedTopology: true},
    );
    dtdb = dbs.db('covid');
  } catch (e) {
    console.log(e);
    console.log('unable to connect to Mongo instance')
    process.exit(1)
  }
  const collections = ['accounts', 'data'];

  console.log('connected to Database');

  for (let col of collections) {
    server.app[col] = dtdb.collection(col);
  }

  return server;
};
