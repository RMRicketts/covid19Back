"use strict";
const Boom = require("@hapi/boom");
const sign = require("../../utils/jwt.js").sign;
const hash = require("../../utils/en.js").hash;

module.exports.createUser = {
  method: "POST",
  path: "/api/1/createUser",
  handler: async (request, h) => {
    let { accounts } = request.server.app;
    let { payload } = request;

    console.log("create User");
    console.log(payload);

    let user = { ...payload };
    user.created = new Date();

    let salt = user.userName + user.created.toString();
    user.pw = hash(user.pw, salt);

    try {
      await accounts.insertOne(user);
    } catch (e) {
      return Boom.notAcceptable("User already exists");
    }

    const accessToken = sign({ userName: user.userName });

    console.log(accessToken);

    return { accessToken };
  }
};
