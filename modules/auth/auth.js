const Boom = require("@hapi/boom");
const jwt = require("../../utils/jwt.js");
const { covidInfo } = require("../../configs/config.js");

module.exports = {
  assign: "authProfile",
  method: async (req, h) => {
    let accessToken = req.headers.accesstoken;
    if (accessToken === covidInfo.token) {
      return { authorized: true };
    }
    try {
      accessToken = req.headers.authorization.split(" ")[1];
    } catch (e) {
      return Boom.unauthorized("Invalid Token");
    }
    let payload;
    try {
      payload = jwt.verify(accessToken);
    } catch (e) {
      console.log(e)
      if (e.message === "jwt expired") {
        return Boom.unauthorized("Expired Access Token");
      }
      return Boom.unauthorized("Invalid Access Token");
    }
    return payload;
  }
};
