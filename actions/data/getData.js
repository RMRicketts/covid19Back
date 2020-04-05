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
      let intKeys = [
        "positive",
        "negative",
        "pending",
        "hospitalizedCurrently",
        "hospitalizedCumulative",
        "inIcuCurrently",
        "inIcuCumulative",
        "onVentilatorCurrently",
        "onVentilatorCumulative",
        "recovered",
        "death",
        "hospitalized",
        "total",
        "totalTestResults",
        "posNeg",
        "deathIncrease",
        "hospitalizedIncrease",
        "negativeIncrease",
        "positiveIncrease",
        "totalTestResultsIncrease"
      ];
      for (let obj of set) {
        if (tmp[obj._id] === undefined) {
          tmp[obj._id] = [];
        }
        for (let d of obj.data) {
          tmp[obj._id].push(d);
          if (map[d.date] === undefined) {
            map[d.date] = {};
            for (let key of Object.keys(d)) {
              if (intKeys.indexOf(key) !== -1) {
                map[d.date][key] = 0;
              }
            }
          }
          for (let key of Object.keys(d)) {
            if (intKeys.indexOf(key) > 0) {
              let num = d[key] === null ? 0 : Number(d[key]);
              map[d.date][key] = map[d.date][key] + num;
            } else {
              d.state = "United States";
              map[d.date][key] = d[key];
            }
          }
          d.date = new Date(d.date);
        }
      }
      for (let date of Object.keys(map)) {
        let d = new Date(date);
        map[date].date = d;
        tmp["United States"].push({ date: new Date(date), ...map[date] });
      }
      for (let key of Object.keys(tmp)) {
        tmp[key].sort((p, n) => {
          return new Date(p.date) - new Date(n.date);
        });
      }
      let response = h.response({ covidData: tmp });
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
