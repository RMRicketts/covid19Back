"use strict";
const Boom = require("@hapi/boom");

module.exports.amAlive = {
  method: "GET",
  path: "/api/1/alive",
  handler: (request, h) => {
    console.log('still alive');
    return {
      alive: true
    };
  }
};
