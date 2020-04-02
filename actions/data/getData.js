"use strict";

const Boom = require('@hapi/boom');

module.exports.getData = {
  method: "GET",
  path: '/api/v1/'
  options: {
    pre: [ require('../../modules/auth/auth.js') ]
  },
  hander: async (request, h) => {
    const {data} = request.server.app
    const {query} = request
    return await data.find(query).toArray()
  }
}
