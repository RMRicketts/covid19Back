const reload = require("./postCovidData.js");

const delay = period => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      return resolve();
    }, period);
  });
};

const loop = async () => {
  reload()
    .then(() => {
      return delay(1 * 60 * 60 * 1000);
    })
    .then(() => {
      return loop();
    })
    .catch(console.log);
};

module.exports = loop;
