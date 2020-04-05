"use strict";

const Boom = require("@hapi/boom");

module.exports.getData = {
  method: "GET",
  path: "/api/1/getData",
  options: {
    pre: [require("../../modules/auth/auth.js")]
  },
  handler: async (request, h) => {
    const { data } = request.server.app;
    const { query } = request;
    console.log("request made to getData", query);
    try {
      let set = await data
        .aggregate([
          {
            $group: {
              _id: "$state",
              data: {
                $push: {
                  date: "$date",
                  state: "$state",
                  positive: "$positive",
                  negative: "$negative",
                  pending: "$pending",
                  hospitalizedCurrently: "$hospitalizedCurrently",
                  hospitalizedCumulative: "$hospitalizedCumulative",
                  inIcuCurrently: "$inIcuCurrently",
                  inIcuCumulative: "$inIcuCumulative",
                  onVentilatorCurrently: "$onVentilatorCurrently",
                  onVentilatorCumulative: "$onVentilatorCumulative",
                  recovered: "$recovered",
                  hash: "$hash",
                  dateChecked: "$dateChecked",
                  death: "$death",
                  hospitalized: "$hospitalized",
                  total: "$total",
                  totalTestResults: "$totalTestResults",
                  posNeg: "$posNeg",
                  fips: "$fips",
                  deathIncrease: "$deathIncrease",
                  hospitalizedIncrease: "$hospitalizedIncrease",
                  negativeIncrease: "$negativeIncrease",
                  positiveIncrease: "$positiveIncrease",
                  totalTestResultsIncrease: "$totalTestResultsIncrease"
                }
              }
            }
          }
        ])
        .toArray();
      let tmp = { "United States": [] };
      let map = {};
      let intKeys = [];
      for (let obj of set) {
        if (tmp[obj._id] === undefined) {
          tmp[obj._id] = [];
        }
        for (let d of obj.data) {
          tmp[obj._id].push(d);
          if (map[d.date] === undefined) {
            map[d.date] = {};
            for (let key of Object.keys(d)) {
              if (typeof d[key] === "number") {
                intKeys.push(key);
                map[d.date][key] = 0;
              }
            }
          }
          for (let key of Object.keys(d)) {
            if (intKeys.indexOf(key) > 0) {
              let num = d[key] === null ? 0 : d[key];
              map[d.date][key] = map[d.date][key] + num;
            } else {
              map[d.date][key] = d[key];
              map[d.date].state = "United States";
            }
          }
        }
      }
      for (let date of Object.keys(map)) {
        tmp["United States"].push({ date: new Date(date), ...map[date] });
      }
      let pkg = {};
      pkg.covidData = tmp;
      let response = h.response(pkg);
      return response;
    } catch (e) {
      console.log("failed");
      return Boom.badImplementation();
    }
  }
};

module.exports.uploadData = {
  method: "POST",
  path: "/api/1/postData",
  options: {
    pre: [require("../../modules/auth/auth.js")]
  },
  handler: async (request, h) => {
    const { data } = request.server.app;
    const { payload } = request;
    console.log("request made to uploadData");
    try {
      await data.deleteMany();
      await data.insertMany(payload.data);
    } catch (e) {
      console.log(e);
      return Boom.badImplementation();
    }
    return { success: true };
  }
};
