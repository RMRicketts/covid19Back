const jwt = require('jsonwebtoken');
const {dtbackDefaultSalt, dtbackDefaultSecret, dtbackPK} = require('../../configs/config.js');
const en = require('./en.js').encrypt;
const de = require('./de.js').decrypt;

module.exports.sign = payload => {
  let pkg = {data: en(JSON.stringify(payload), dtbackDefaultSecret, dbackDefaultSalt)};
  return jwt.sign(pkg, dtbackPK, {expiresIn: 60 * 60});
};

module.exports.verify = token => {
  let pkg = jwt.verify(token, dtbackPK);
  return JSON.parse(de(pkg.data, dtbackDefaultSecret, dtbackDefaultSalt));
};
