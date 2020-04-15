"use strict";
const Boom = require("@hapi/boom");
const sign = require("../../utils/jwt.js").sign;
const hash = require("../../utils/en.js").hash;

module.exports.login = {
  method: "POST",
  path: "/api/1/login",
  handler: async (request, h) => {
    let { accounts } = request.server.app;
    let { params, payload } = request;

    console.log(params);

    let preProfile = await accounts.findOne(
      { userName: new RegExp(payload.userName,'i') },
      { userName: 1, created: 1, pw: 1, _id: 0 }
    );
    if (preProfile === null) {
      return Boom.unathorized("Invalid login");
    }

    let salt = preProfile.userName + preProfile.created.toString();
    let pw = hash(payload.pw, salt);

    if (pw !== preProfile.pw) {
      return Boom.unauthorized("Invalid login");
    }

    let userProfile = {
      userName: preProfile.userName
    };

    const accessToken = sign(userProfile);

    return { accessToken };
  }
};
