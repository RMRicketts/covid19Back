'use strict';

const mongo = require('mongodb');
const configs = require('../configs/config.js');
const fs = require('fs').promises

module.exports = async server => {
  const connectionURI = process.NODE_ENV === 'production' ? configs.mongoProd : configs.mongoDev;
  console.log('hi')
  await fs.writeFile('./conf', connectionURI)
  console.log('there')
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
    throw new Error('unable to connect to Mongo instance');
  }
  const collections = ['accounts', 'data'];

  console.log('connected to Database');

  for (let col of collections) {
    server.app[col] = dtdb.collection(col);
  }

  return server;
};
