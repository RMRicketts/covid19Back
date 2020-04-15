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

    let userInfo = { ...payload };
    let user = {};
    user.userName = userInfo.userName;
    user.pw = userInfo.pw;
    user.created = new Date();

    let salt = user.userName + user.created.toString();
    user.pw = hash(user.pw, salt);

    try {
      let res = await accounts.updateOne(
        { userName: new RegExp(user.userName, "i") },
        { $setOnInsert: user },
        { upsert: true }
      );
      if (res.result.upserted === undefined) {
        return Boom.notAcceptable("User already exists");
      }
    } catch (e) {
      return Boom.badImplementation();
    }

    const accessToken = sign({ userName: user.userName });

    console.log(accessToken);

    return { accessToken: accessToken };
  }
};
