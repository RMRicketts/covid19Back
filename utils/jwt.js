const jwt = require("jsonwebtoken");
const {
  dtbackDefaultSalt,
  dtbackDefaultSecret,
  dtbackPK
} = require("../configs/config.js");
const en = require("./en.js").encrypt;
const de = require("./de.js").decrypt;

module.exports.sign = payload => {
  let pkg = {
    data: en(JSON.stringify(payload), dtbackDefaultSecret, dtbackDefaultSalt)
  };
  let token = {}
  let dt = new Date()
  dt.setHours( dt.getHours() + 1 )
  token.expiresAt = dt
  token.Authorization = jwt.sign(pkg, dtbackPK, { expiresIn: 60 * 60 });
  return token
};

module.exports.verify = token => {
  let pkg = jwt.verify(token, dtbackPK);
  return JSON.parse(de(pkg.data, dtbackDefaultSecret, dtbackDefaultSalt));
};
