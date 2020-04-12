const crypto = require("crypto");
const {
  dtbackHashAlg,
  dtbackCipherAlg,
  dtbackDefaulSalt
} = require("../configs/config.js");

module.exports.hash = (payload, secret) => {
  const hash = crypto
    .createHmac(dtbackHashAlg, secret + dtbackDefaulSalt)
    .update(payload)
    .digest("hex");
  return hash;
};

module.exports.encrypt = (payload, secret, salt) => {
  const alg = dtbackCipherAlg;
  const key = crypto.scryptSync(secret, salt, 32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(alg, key, iv);

  let encrypted = cipher.update(payload, "utf8", "hex");
  encrypted += cipher.final("hex");
  encrypted = iv.toString("hex") + ":" + encrypted;

  return encrypted;
};
