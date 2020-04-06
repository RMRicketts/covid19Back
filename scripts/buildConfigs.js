const fs = require("fs").promises;

module.exports.buildEnv = async cons => {
  let contents =
    "MONGO_ROOT=" +
    cons.mongoUser +
    "\n" +
    "MONGO_ROOT_PW=" +
    cons.mongoPW +
    "\n" +
    "MONGO_EXPRESS=" +
    cons.mongoExpress +
    "\n" +
    "MONGO_EXPORES_PW=" +
    cons.mongoExpressPW;
  return await fs.writeFile(__dirname+"/../.env", contents);
};

module.exports.buildConfigs = async cons => {
  await fs.mkdir(__dirname+"/../configs");
  let func =
    "module.exports = (() => {\n  let configs = " +
    JSON.stringify(cons, null, 2) +
    "\n  return configs\n})()";
  await fs.writeFile(__dirname+"/../configs/config.js", func);
};

let create = async () => {
  let dir = await fs.opendir(__dirname+"/../");
  let env = {};
  let create = [];
  let confFlag = true;
  for await (let dirent of dir) {
    env[dirent.name] = true;
  }
  if (env.configs === undefined) {
    create.push("buildConfigs");
    confFlag = false;
  }
  if (env[".env"] === undefined) {
    create.push("buildEnv");
  }
  if (create.length === 0) {
    console.log("files already exist");
    return;
  }
  console.log(create)
  let confs;
  if (confFlag) {
    confs = require(__dirname+"/../configs/config.js");
  } else {
    confs = configs();
  }
  for (let fun of create) {
    await this[fun](confs);
  }
};

let configs = () => {
  let json = {
    mongoUser: "root",
    mongoPW: randomString(64),
    mongoExpress: "root",
    mongoExpressPW: randomString(64),
    dtbackHashAlg: "sha3-512",
    dtbackCipherAlg: "aes-256-cbc",
    dtbackPK: randomString(512),
    dtbackDefaultSalt: randomString(512),
    dtbackDefaultSecret: randomString(512),
    covidInfo: {
      token: randomString(512),
      url: "http://localhost:8081/api/1/postData"
    }
  };
  json.mongoAdmin = `mongodb://${json.mongoUser}:${json.mongoPW}@mongodb:27017/covid`;
  json.mongoDev = `mongodb://${json.mongoUser}:${json.mongoPW}@mongodb:27017/covid`;
  return json;
};

let randomString = len => {
  let str = "";
  while (str.length < len) {
    str =
      str +
      Math.random()
        .toString(36)
        .substring(2, 32);
  }
  return str;
};

create();
