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
  return jwt.sign(pkg, dtbackPK, { expiresIn: 60 * 60 });
};

module.exports.verify = token => {
  let pkg;
  try {
    pkg = jwt.verify(token, dtbackPK);
  } catch (e) {
    console.log(e);
    throw e;
  }
  return JSON.parse(de(pkg.data, dtbackDefaultSecret, dtbackDefaultSalt));
};
