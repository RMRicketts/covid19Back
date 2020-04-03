"use strict";

const Boom = require("@hapi/boom");

module.exports.getData = {
  method: "GET",
  path: "/api/1/getData",
  options: {
    pre: [require("../../modules/auth/auth.js")]
  },
  handler: async (request, h) => {
    const { data } = request.server.app;
    const { query } = request;
    try {
      return await data.find(query).toArray();
    } catch (e) {
      return Boom.badImplementation();
    }
  }
};

module.exports.uploadData = {
  method: "POST",
  path: "/api/1/postData",
  options: {
    pre: [require("../../modules/auth/auth.js")]
  },
  handler: async (request, h) => {
    const { data } = request.server.app;
    const { payload } = request;
    try {
      await data.deleteMany();
      await data.insertMany(payload.data);
    } catch (e) {
      console.log(e);
      return Boom.badImplementation();
    }
    return { success: true };
  }
};
