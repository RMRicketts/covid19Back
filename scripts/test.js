const configs = require('../configs/config.js')
const mongo = require('mongodb')

mongo.connect(configs.mongoAdmin).then( dbs =>  {}).catch(console.log)
