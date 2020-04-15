const Boom = require("@hapi/boom");
const jwt = require("../../utils/jwt.js");
const { covidInfo, dtbackPK } = require("../../configs/config.js");

module.exports = {
  assign: "authProfile",
  method: async (req, h) => {
    let accessToken = req.headers.accesstoken;
    if (accessToken === covidInfo.token) {
      return { authorized: true };
    }
    try {
      accessToken = req.headers.Authorization.split(" ")[0];
    } catch (e) {
      return Boom.unauthorized("Invalid Token");
    }
    let payload;
    try {
      payload = jwt.verify(payload, dtbackPK);
    } catch (e) {
      if (e.message === "jwt expired") {
        let error = Boom.unathorized("Access token expired");
        error.output.payload.code = "ACCESS_EXPIRED";
        return Boom.unauthorized("Expired Access Token");
      }
      return Boom.unauthorized("Invalid Access Token");
    }
    return payload;
  }
};
